import os
import re
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="VibeLocal AI - Indonesian Emergency Situation Intelligence System",
    description="Sistem Klasifikasi dan Respons Darurat Lokal Indonesia",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmergencyInput(BaseModel):
    user_input: str
    location: Optional[str] = None

class RecommendedPlace(BaseModel):
    name: str
    type: str
    distance: str
    action: str
    contact: str
    note: str

class EmergencyAction(BaseModel):
    suggested_step: str
    call_to_action: str
    share_location_message: str

class EmergencyResponse(BaseModel):
    category: str
    urgency_level: str
    summary: str
    recommended_places: List[RecommendedPlace]
    emergency_action: EmergencyAction

EMERGENCY_KEYWORDS = {
    "medical": {
        "keywords": ["sakit", "cedera", "luka", "pendarahan", " pingsan", "sesak", "jantung", "stroke", "kecelakaan", "tabrak", "tabrakan", "terbakar", "demam tinggi", "gatal", "alergi", "keracunan", "mual", "muntah", "diare", "patah", "kram"],
        "urgency": "high",
        "category": "medical_emergency"
    },
    "security": {
        "keywords": ["begal", "copet", "maling", "perampokan", "pelecehan", "kejahatan", "kekerasan", "tawuran", "bentrok", "ricuh", "teror", "bom", "senjata", "pisau", "senapan"],
        "urgency": "high",
        "category": "security_emergency"
    },
    "fire": {
        "keywords": ["kebakaran", "api", "asap", "ledakan", "gas bocor", "api unggun liar", "short", "korsleting", "pemadam"],
        "urgency": "high",
        "category": "fire_emergency"
    },
    "natural_disaster": {
        "keywords": ["banjir", "gempa", "tsunami", "tanah longsor", "gunung meletus", "puting beliung", "badai", "kekeringan", "abrasi", "angin kencang"],
        "urgency": "high",
        "category": "natural_disaster"
    },
    "vehicle": {
        "keywords": ["mobil mogok", "motor mogok", "ban bocor", "mesin mati", "accu tekor", "towing", "bensin habis", "kecelakaan lalu lintas"],
        "urgency": "medium",
        "category": "vehicle_breakdown"
    },
    "rescue": {
        "keywords": ["tersesat", "hilang", "jebak", "tertinggal", "terkunci", "diculik", "dicari", "orang hilang", "anak hilang"],
        "urgency": "high",
        "category": "rescue_needed"
    }
}

def classify_emergency(text: str) -> dict:
    text_lower = text.lower()
    
    for emergency_type, data in EMERGENCY_KEYWORDS.items():
        for keyword in data["keywords"]:
            if keyword in text_lower:
                return {
                    "type": emergency_type,
                    "urgency": data["urgency"],
                    "category": data["category"]
                }
    
    return {"type": "general", "urgency": "medium", "category": "general_urgent"}

def get_recommended_places(classification: dict, location: Optional[str] = None) -> List[dict]:
    emergency_type = classification["type"]
    
    places_map = {
        "medical": [
            {
                "name": "RSUD Terdekat / IGD",
                "type": "Rumah Sakit",
                "distance": "2.5km",
                "action": "navigate",
                "contact": "119",
                "note": "Segera ke IGD untuk penanganan medis darurat"
            },
            {
                "name": "Klinik 24 Jam Terdekat",
                "type": "Klinik",
                "distance": "1km",
                "action": "navigate",
                "contact": "119",
                "note": "Untuk pertolongan pertama sebelum ke RS"
            },
            {
                "name": "Ambulans Darurat",
                "type": "Ambulans",
                "distance": "0m",
                "action": "call",
                "contact": "118",
                "note": "Hubungi jika tidak bisa bergerak atau kritis"
            }
        ],
        "security": [
            {
                "name": "Polsek Terdekat",
                "type": "Polisi",
                "distance": "1.5km",
                "action": "navigate",
                "contact": "110",
                "note": "Laporkan kejadian kejahatan ke polisi terdekat"
            },
            {
                "name": "Pos Polisi 24 Jam",
                "type": "Polisi",
                "distance": "3km",
                "action": "call",
                "contact": "110",
                "note": "Hubungi 110 untuk laporan darurat keamanan"
            },
            {
                "name": "Satpam Komplek",
                "type": "Keamanan",
                "distance": "100m",
                "action": "whatsapp",
                "contact": "081234567890",
                "note": "Hubungi satpam terdekat untuk bantuan segera"
            }
        ],
        "fire": [
            {
                "name": "Pemadam Kebakaran",
                "type": "Pemadam",
                "distance": "5km",
                "action": "call",
                "contact": "113",
                "note": "Hubungi segera untuk kebakaran besar"
            },
            {
                "name": "Damkar Terdekat",
                "type": "Pemadam",
                "distance": "3km",
                "action": "call",
                "contact": "113",
                "note": "Jangan padamkan sendiri jika berbahaya"
            }
        ],
        "natural_disaster": [
            {
                "name": "Posko Bencana Terdekat",
                "type": "Posko",
                "distance": "5km",
                "action": "navigate",
                "contact": "117",
                "note": "Evakuasi ke posko bencana terdekat"
            },
            {
                "name": "BPBD Kabupaten/Kota",
                "type": "BPBD",
                "distance": "10km",
                "action": "call",
                "contact": "117",
                "note": "Laporkan kondisi bencana untuk respons tim SAR"
            },
            {
                "name": "Basarnas",
                "type": "SAR",
                "distance": "Regional",
                "action": "call",
                "contact": "115",
                "note": "Untuk pencarian dan pertolongan besar"
            }
        ],
        "vehicle": [
            {
                "name": "Bengkel 24 Jam Terdekat",
                "type": "Bengkel",
                "distance": "2km",
                "action": "navigate",
                "contact": "082134567890",
                "note": "Towing dan perbaikan darurat kendaraan"
            },
            {
                "name": "SPBU Terdekat",
                "type": "Bahan Bakar",
                "distance": "1km",
                "action": "navigate",
                "contact": "1500000",
                "note": "Jika bensin habis atau accu masalah"
            }
        ],
        "rescue": [
            {
                "name": "Polsek Terdekat",
                "type": "Polisi",
                "distance": "1.5km",
                "action": "call",
                "contact": "110",
                "note": "Laporkan orang hilang segera"
            },
            {
                "name": "Basarnas",
                "type": "SAR",
                "distance": "Regional",
                "action": "call",
                "contact": "115",
                "note": "Untuk pencarian orang hilang"
            }
        ],
        "general": [
            {
                "name": "Pusat Layanan Darurat Nasional 112",
                "type": "Pusat Bantuan",
                "distance": "0m",
                "action": "call",
                "contact": "112",
                "note": "Hubungi nomor darurat terpadu untuk bantuan apapun"
            },
            {
                "name": "Kantor Polisi Terdekat",
                "type": "Keamanan",
                "distance": "1.5km",
                "action": "navigate",
                "contact": "110",
                "note": "Segera mengamankan diri ke kantor polisi jika terdapat ancaman"
            },
            {
                "name": "Klinik 24 Jam Terdekat",
                "type": "Medis",
                "distance": "2km",
                "action": "navigate",
                "contact": "119",
                "note": "Cari bantuan medis terdekat jika ada cedera"
            }
        ]
    }
    
    return places_map.get(emergency_type, places_map["general"])

def get_emergency_action(classification: dict) -> dict:
    actions = {
        "medical": {
            "suggested_step": "Pertahankan ketenangan. Jika ada pendarahan, tekan luka dengan kain bersih. Jangan pindahkan korban kecuali berbahaya.",
            "call_to_action": "Segera hubungi 119 atau ke IGD terdekat",
            "share_location_message": "Tolong! Saya butuh bantuan medis darurat. Ini lokasi saya:"
        },
        "security": {
            "suggested_step": "Prioritaskan keselamatan diri. Menyerah pada barang, tidak pada nyawa. Ingat ciri-ciri pelaku.",
            "call_to_action": "Hubungi 110 atau bergegas ke polisi terdekat",
            "share_location_message": "Tolong! Saya butuh bantuan keamanan segera. Ada kejahatan di lokasi ini:"
        },
        "fire": {
            "suggested_step": "Evakuasi segera. Jangan gunakan lift. Tetap rendah jika ada asap. Tutup mulut dengan kain basah.",
            "call_to_action": "Hubungi 113 dan evakuasi ke titik kumpul aman",
            "share_location_message": "Kebakaran! Butuh bantuan pemadam segera di lokasi ini:"
        },
        "natural_disaster": {
            "suggested_step": "Ikuti jalur evakuasi. Bawa emergency kit. Tetap tenang dan ikuti instruksi petugas.",
            "call_to_action": "Evakuasi ke posko bencana atau hubungi 117",
            "share_location_message": "Bencana alam! Butuh evakuasi di lokasi ini:"
        },
        "vehicle": {
            "suggested_step": "Aktifkan lampu hazard. Pasang segitiga pengaman. Jangan tinggal di dalam mobil di jalan raya.",
            "call_to_action": "Hubungi bengkel 24 jam atau towing service",
            "share_location_message": "Kendaraan mogok! Butuh bantuan di lokasi ini:"
        },
        "rescue": {
            "suggested_step": "Tetap di tempat terbuka jika tersesat. Buat sinyal asap atau suara. Hemat baterai HP.",
            "call_to_action": "Hubungi 115 (Basarnas) atau kirim lokasi ke keluarga",
            "share_location_message": "Saya tersesat/hilang! Butuh bantuan pencarian di lokasi ini:"
        },
        "general": {
            "suggested_step": "Pastikan Anda berada di tempat yang aman. Ketik ulang situasi dengan lebih spesifik.",
            "call_to_action": "Hubungi 112 untuk layanan darurat terpadu",
            "share_location_message": "Tolong! Saya butuh bantuan segera di lokasi ini:"
        }
    }
    
    return actions.get(classification["type"], actions["general"])

def get_summary(classification: dict, user_input: str) -> str:
    summaries = {
        "medical": f"Terdeteksi EMERGENSI MEDIS: '{user_input}'. Segera dapatkan pertolongan medis.",
        "security": f"Terdeteksi ANCAMAN KEAMANAN: '{user_input}'. Prioritaskan keselamatan diri.",
        "fire": f"Terdeteksi EMERGENSI API/KEBAKARAN: '{user_input}'. Evakuasi segera.",
        "natural_disaster": f"Terdeteksi BENCANA ALAM: '{user_input}'. Ikuti prosedur evakuasi.",
        "vehicle": f"Terdeteksi MASALAH KENDARAAN: '{user_input}'. Hubungi layanan darurat kendaraan.",
        "rescue": f"Terdeteksi BUTUH PERTOLONGAN/PENCARIAN: '{user_input}'. Kirim lokasi Anda.",
        "general": f"Input diterima: '{user_input}'. Mohon berikan detail lebih spesifik jika darurat."
    }
    
    return summaries.get(classification["type"], summaries["general"])

@app.get("/")
async def root():
    return FileResponse("index.html")

@app.get("/api")
async def api_info():
    return {
        "message": "VibeLocal AI - Indonesian Emergency Situation Intelligence System",
        "status": "active",
        "docs": "/docs",
        "endpoints": {
            "analyze": "/analyze",
            "categories": "/categories",
            "emergency_numbers": "/emergency-numbers"
        }
    }

@app.post("/analyze", response_model=EmergencyResponse)
async def analyze_emergency(input_data: EmergencyInput):
    try:
        classification = classify_emergency(input_data.user_input)
        
        response = EmergencyResponse(
            category=classification["category"],
            urgency_level=classification["urgency"],
            summary=get_summary(classification, input_data.user_input),
            recommended_places=[RecommendedPlace(**place) for place in get_recommended_places(classification, input_data.location)],
            emergency_action=EmergencyAction(**get_emergency_action(classification))
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "medical_emergency", "name": "Emergensi Medis", "icon": "🏥"},
            {"id": "security_emergency", "name": "Keamanan", "icon": "🚔"},
            {"id": "fire_emergency", "name": "Kebakaran", "icon": "🔥"},
            {"id": "natural_disaster", "name": "Bencana Alam", "icon": "🌊"},
            {"id": "vehicle_breakdown", "name": "Kendala Kendaraan", "icon": "🚗"},
            {"id": "rescue_needed", "name": "Pencarian", "icon": "🔍"},
            {"id": "general_urgent", "name": "Umum", "icon": "⚠️"}
        ]
    }

@app.get("/emergency-numbers")
async def get_emergency_numbers():
    return {
        "emergency_numbers": [
            {"number": "112", "name": "Nomor Darurat Terpadu", "category": "general"},
            {"number": "110", "name": "Polisi", "category": "security"},
            {"number": "113", "name": "Pemadam Kebakaran", "category": "fire"},
            {"number": "115", "name": "Basarnas/SAR", "category": "rescue"},
            {"number": "117", "name": "BPBD", "category": "disaster"},
            {"number": "118", "name": "Ambulans", "category": "medical"},
            {"number": "119", "name": "Kementerian Kesehatan", "category": "medical"},
            {"number": "151", "name": "Posko COVID-19", "category": "medical"}
        ]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
