import os
import json
import asyncio
from datetime import datetime
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn

# Import Google Maps Service
try:
    from maps_service import GoogleMapsService, get_search_keywords, CATEGORY_KEYWORDS
    maps_service = GoogleMapsService()
    GOOGLE_MAPS_ENABLED = True
except ImportError:
    print("⚠️ Google Maps Service not available. Using mock data.")
    GOOGLE_MAPS_ENABLED = False
    maps_service = None

app = FastAPI(
    title="VibeLocal AI - Real-Time Emergency Intelligence",
    description="Sistem Klasifikasi Darurat Real-Time dengan WebSocket dan GPS",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ DATA MODELS ============

class EmergencyInput(BaseModel):
    user_input: str
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class LocationUpdate(BaseModel):
    lat: float
    lng: float
    accuracy: Optional[float] = None
    emergency_id: Optional[str] = None

class ChatMessage(BaseModel):
    emergency_id: str
    sender: str  # 'user' atau 'responder'
    message: str
    timestamp: Optional[str] = None

class EmergencyStatus(BaseModel):
    emergency_id: str
    status: str  # 'pending', 'responding', 'resolved'
    responder_name: Optional[str] = None
    eta_minutes: Optional[int] = None
    last_updated: str

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
    emergency_id: str
    category: str
    urgency_level: str
    summary: str
    recommended_places: List[RecommendedPlace]
    emergency_action: EmergencyAction
    timestamp: str
    location: Optional[Dict] = None

# ============ DATABASE (In-Memory untuk Real-time) ============

active_emergencies: Dict[str, dict] = {}
emergency_history: List[dict] = []
connected_clients: Dict[str, WebSocket] = {}

# ============ KEYWORD CLASSIFICATION ============

EMERGENCY_KEYWORDS = {
    "medical": {
        "keywords": ["sakit", "cedera", "luka", "pendarahan", "pingsan", "sesak", "jantung", "stroke", "kecelakaan", "tabrak", "terbakar", "demam tinggi", "gatal", "alergi", "keracunan", "mual", "muntah", "diare", "patah", "kram"],
        "urgency": "high",
        "category": "medical_emergency"
    },
    "security": {
        "keywords": ["begal", "copet", "maling", "perampokan", "pelecehan", "kejahatan", "kekerasan", "tawuran", "bentrok", "ricuh", "teror"],
        "urgency": "high",
        "category": "security_emergency"
    },
    "fire": {
        "keywords": ["kebakaran", "api", "asap", "ledakan", "gas bocor"],
        "urgency": "high",
        "category": "fire_emergency"
    },
    "natural_disaster": {
        "keywords": ["banjir", "gempa", "tsunami", "tanah longsor", "gunung meletus", "puting beliung", "badai"],
        "urgency": "high",
        "category": "natural_disaster"
    },
    "vehicle": {
        "keywords": ["mobil mogok", "motor mogok", "ban bocor", "mesin mati", "accu tekor", "towing", "bensin habis"],
        "urgency": "medium",
        "category": "vehicle_breakdown"
    },
    "rescue": {
        "keywords": ["tersesat", "hilang", "jebak", "tertinggal", "terkunci", "diculik"],
        "urgency": "high",
        "category": "rescue_needed"
    }
}

# ============ HELPER FUNCTIONS ============

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

def get_recommended_places(classification: dict, lat: float = None, lng: float = None) -> List[dict]:
    """
    Get recommended places - Real Google Maps data if available, otherwise fallback
    """
    emergency_type = classification["type"]
    category = classification["category"]
    
    # Try to get real places from Google Maps if coordinates available
    if GOOGLE_MAPS_ENABLED and maps_service and lat and lng:
        try:
            keywords_data = get_search_keywords(category)
            search_keywords = keywords_data.get("keywords", ["emergency services"])
            
            # Search for places using first keyword
            keyword = search_keywords[0] if search_keywords else "emergency"
            places = maps_service.search_nearby_places(
                lat=lat,
                lng=lng,
                keyword=keyword,
                radius=10000,  # 10km radius
                max_results=5
            )
            
            if places:
                formatted_places = []
                for place in places:
                    # Calculate formatted distance
                    distance_str = maps_service._format_distance(place.distance_meters)
                    
                    # Determine action based on place type
                    action = "navigate"
                    if place.types and any(t in ["hospital", "police", "fire_station"] for t in place.types):
                        action = "call"
                    
                    # Check if open 24 hours
                    open_24h = False
                    if place.opening_hours:
                        open_24h = place.opening_hours.get("open_now", False)
                    
                    note = f"Rating: {place.rating}/5" if place.rating else "Hubungi untuk info"
                    if open_24h:
                        note += " • Buka 24 Jam"
                    
                    formatted_places.append({
                        "name": place.name,
                        "type": place.types[0].replace("_", " ").title() if place.types else "Tempat",
                        "distance": distance_str,
                        "action": action,
                        "contact": place.phone_number or "",  # Will be populated if available
                        "note": note,
                        "place_id": place.place_id,
                        "lat": place.latitude,
                        "lng": place.longitude,
                        "address": place.address
                    })
                
                if formatted_places:
                    return formatted_places
                    
        except Exception as e:
            print(f"Error getting real places from Google Maps: {e}")
            # Fall through to default places
    
    # Fallback default places (when Google Maps not available or error)
    places_map = {
        "medical": [
            {"name": "RSUD Terdekat / IGD", "type": "Rumah Sakit", "distance": "2.5km", "action": "navigate", "contact": "119", "note": "Segera ke IGD untuk penanganan medis darurat"},
            {"name": "Klinik 24 Jam Terdekat", "type": "Klinik", "distance": "1km", "action": "navigate", "contact": "119", "note": "Untuk pertolongan pertama sebelum ke RS"},
            {"name": "Ambulans Darurat", "type": "Ambulans", "distance": "0m", "action": "call", "contact": "118", "note": "Hubungi jika tidak bisa bergerak atau kritis"}
        ],
        "security": [
            {"name": "Polsek Terdekat", "type": "Polisi", "distance": "1.5km", "action": "navigate", "contact": "110", "note": "Laporkan kejadian kejahatan ke polisi terdekat"},
            {"name": "Pos Polisi 24 Jam", "type": "Polisi", "distance": "3km", "action": "call", "contact": "110", "note": "Hubungi 110 untuk laporan darurat keamanan"}
        ],
        "fire": [
            {"name": "Pemadam Kebakaran", "type": "Pemadam", "distance": "5km", "action": "call", "contact": "113", "note": "Hubungi segera untuk kebakaran besar"},
            {"name": "Damkar Terdekat", "type": "Pemadam", "distance": "3km", "action": "call", "contact": "113", "note": "Jangan padamkan sendiri jika berbahaya"}
        ],
        "natural_disaster": [
            {"name": "Posko Bencana Terdekat", "type": "Posko", "distance": "5km", "action": "navigate", "contact": "117", "note": "Evakuasi ke posko bencana terdekat"},
            {"name": "BPBD Kabupaten/Kota", "type": "BPBD", "distance": "10km", "action": "call", "contact": "117", "note": "Laporkan kondisi bencana untuk respons tim SAR"},
            {"name": "Basarnas", "type": "SAR", "distance": "Regional", "action": "call", "contact": "115", "note": "Untuk pencarian dan pertolongan besar"}
        ],
        "vehicle": [
            {"name": "Bengkel 24 Jam Terdekat", "type": "Bengkel", "distance": "2km", "action": "navigate", "contact": "", "note": "Towing dan perbaikan darurat kendaraan"},
            {"name": "SPBU Terdekat", "type": "Bahan Bakar", "distance": "1km", "action": "navigate", "contact": "1500000", "note": "Jika bensin habis atau accu masalah"}
        ],
        "rescue": [
            {"name": "Polsek Terdekat", "type": "Polisi", "distance": "1.5km", "action": "call", "contact": "110", "note": "Laporkan orang hilang segera"},
            {"name": "Basarnas", "type": "SAR", "distance": "Regional", "action": "call", "contact": "115", "note": "Untuk pencarian orang hilang"}
        ],
        "general": [
            {"name": "Pusat Layanan Darurat Nasional 112", "type": "Pusat Bantuan", "distance": "0m", "action": "call", "contact": "112", "note": "Hubungi nomor darurat terpadu untuk bantuan apapun"},
            {"name": "Kantor Polisi Terdekat", "type": "Keamanan", "distance": "1.5km", "action": "navigate", "contact": "110", "note": "Segera mengamankan diri ke kantor polisi jika terdapat ancaman"}
        ]
    }
    
    return places_map.get(emergency_type, places_map["general"])

def get_emergency_action(classification: dict) -> dict:
    actions = {
        "medical": {
            "suggested_step": "Pertahankan ketenangan. Jika ada pendarahan, tekan luka dengan kain bersih.",
            "call_to_action": "Segera hubungi 119 atau ke IGD terdekat",
            "share_location_message": "Tolong! Saya butuh bantuan medis darurat. Lokasi:"
        },
        "security": {
            "suggested_step": "Prioritaskan keselamatan diri. Menyerah pada barang, tidak pada nyawa.",
            "call_to_action": "Hubungi 110 atau bergegas ke polisi terdekat",
            "share_location_message": "Tolong! Saya butuh bantuan keamanan segera. Lokasi:"
        },
        "fire": {
            "suggested_step": "Evakuasi segera. Jangan gunakan lift. Tetap rendah jika ada asap.",
            "call_to_action": "Hubungi 113 dan evakuasi ke titik kumpul aman",
            "share_location_message": "Kebakaran! Butuh bantuan pemadam segera. Lokasi:"
        },
        "natural_disaster": {
            "suggested_step": "Ikuti jalur evakuasi. Bawa emergency kit. Tetap tenang.",
            "call_to_action": "Evakuasi ke posko bencana atau hubungi 117",
            "share_location_message": "Bencana alam! Butuh evakuasi di lokasi:"
        },
        "vehicle": {
            "suggested_step": "Aktifkan lampu hazard. Pasang segitiga pengaman. Jangan tinggal di dalam mobil.",
            "call_to_action": "Hubungi bengkel 24 jam atau towing service",
            "share_location_message": "Kendaraan mogok! Butuh bantuan di lokasi:"
        },
        "rescue": {
            "suggested_step": "Tetap di tempat terbuka jika tersesat. Buat sinyal asap atau suara.",
            "call_to_action": "Hubungi 115 (Basarnas) atau kirim lokasi ke keluarga",
            "share_location_message": "Saya tersesat! Butuh bantuan di lokasi:"
        },
        "general": {
            "suggested_step": "Pastikan Anda berada di tempat yang aman. Ketik ulang situasi dengan lebih spesifik.",
            "call_to_action": "Hubungi 112 untuk layanan darurat terpadu",
            "share_location_message": "Tolong! Saya butuh bantuan di lokasi:"
        }
    }
    
    return actions.get(classification["type"], actions["general"])

def get_summary(classification: dict, user_input: str) -> str:
    summaries = {
        "medical": f"🚨 EMERGENSI MEDIS: '{user_input}'. Segera dapatkan pertolongan medis.",
        "security": f"🚨 ANCAMAN KEAMANAN: '{user_input}'. Prioritaskan keselamatan diri.",
        "fire": f"🔥 EMERGENSI API: '{user_input}'. Evakuasi segera.",
        "natural_disaster": f"🌊 BENCANA ALAM: '{user_input}'. Ikuti prosedur evakuasi.",
        "vehicle": f"🚗 MASALAH KENDARAAN: '{user_input}'. Hubungi layanan darurat kendaraan.",
        "rescue": f"🔍 BUTUH PERTOLONGAN: '{user_input}'. Kirim lokasi Anda.",
        "general": f"⚠️ Input: '{user_input}'. Mohon berikan detail lebih spesifik jika darurat."
    }
    
    return summaries.get(classification["type"], summaries["general"])

def generate_emergency_id() -> str:
    import uuid
    return f"EMRG-{uuid.uuid4().hex[:8].upper()}"

# ============ HTTP ENDPOINTS ============

@app.get("/")
async def root():
    return FileResponse("index_realtime.html")

@app.get("/api")
async def api_info():
    return {
        "message": "VibeLocal AI - Real-Time Emergency System",
        "status": "active",
        "features": ["websocket", "gps-tracking", "realtime-chat"],
        "active_emergencies": len(active_emergencies),
        "docs": "/docs"
    }

@app.post("/api/analyze")
@app.post("/analyze")
async def analyze_emergency(input_data: EmergencyInput):
    try:
        emergency_id = generate_emergency_id()
        classification = classify_emergency(input_data.user_input)
        timestamp = datetime.now().isoformat()
        
        # Get real places with location if available
        recommended_places = get_recommended_places(
            classification, 
            lat=input_data.lat, 
            lng=input_data.lng
        )
        
        # Add Google Maps navigation URLs if location available
        if input_data.lat and input_data.lng and GOOGLE_MAPS_ENABLED:
            for place in recommended_places:
                if "place_id" in place and place.get("place_id"):
                    place["maps_url"] = f"https://www.google.com/maps/search/?api=1&query={place['name'].replace(' ', '+')}"
                if place.get("lat") and place.get("lng"):
                    place["directions_url"] = maps_service.get_directions_url(
                        input_data.lat, 
                        input_data.lng, 
                        place["name"],
                        place["lat"],
                        place["lng"]
                    ) if maps_service else None
        
        response_data = {
            "emergency_id": emergency_id,
            "category": classification["category"],
            "urgency_level": classification["urgency"],
            "summary": get_summary(classification, input_data.user_input),
            "recommended_places": recommended_places,
            "emergency_action": get_emergency_action(classification),
            "timestamp": timestamp,
            "location": {
                "lat": input_data.lat,
                "lng": input_data.lng,
                "address": input_data.location
            } if input_data.lat and input_data.lng else None,
            "google_maps_enabled": GOOGLE_MAPS_ENABLED
        }
        
        # Simpan ke active emergencies
        active_emergencies[emergency_id] = {
            **response_data,
            "status": "pending",
            "chat_history": [],
            "location_history": [],
            "responder": None
        }
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/location/update")
async def update_location(update: LocationUpdate):
    """Update lokasi real-time dari client"""
    if update.emergency_id and update.emergency_id in active_emergencies:
        active_emergencies[update.emergency_id]["location_history"].append({
            "lat": update.lat,
            "lng": update.lng,
            "accuracy": update.accuracy,
            "timestamp": datetime.now().isoformat()
        })
        
        # Broadcast ke semua connected clients
        await broadcast_message({
            "type": "location_update",
            "emergency_id": update.emergency_id,
            "location": {"lat": update.lat, "lng": update.lng}
        })
        
        return {"status": "updated", "emergency_id": update.emergency_id}
    
    return {"status": "no_emergency_active"}

@app.get("/emergency/{emergency_id}/status")
async def get_emergency_status(emergency_id: str):
    """Get status emergency real-time"""
    if emergency_id in active_emergencies:
        emergency = active_emergencies[emergency_id]
        return {
            "emergency_id": emergency_id,
            "status": emergency["status"],
            "responder": emergency.get("responder"),
            "chat_count": len(emergency["chat_history"]),
            "location_updates": len(emergency["location_history"]),
            "last_updated": emergency["timestamp"]
        }
    raise HTTPException(status_code=404, detail="Emergency not found")

@app.get("/emergency/{emergency_id}/chat")
async def get_chat_history(emergency_id: str):
    """Get chat history"""
    if emergency_id in active_emergencies:
        return {"chat_history": active_emergencies[emergency_id]["chat_history"]}
    raise HTTPException(status_code=404, detail="Emergency not found")

@app.post("/emergency/{emergency_id}/chat")
async def send_chat_message(emergency_id: str, message: ChatMessage):
    """Send chat message"""
    if emergency_id in active_emergencies:
        msg_data = {
            "sender": message.sender,
            "message": message.message,
            "timestamp": datetime.now().isoformat()
        }
        active_emergencies[emergency_id]["chat_history"].append(msg_data)
        
        # Broadcast ke WebSocket clients
        await broadcast_message({
            "type": "new_message",
            "emergency_id": emergency_id,
            "message": msg_data
        })
        
        return {"status": "sent"}
    raise HTTPException(status_code=404, detail="Emergency not found")

@app.get("/categories")
async def get_categories():
    return {
        "categories": [
            {"id": "medical_emergency", "name": "Emergensi Medis", "icon": "🏥", "color": "#dc2626"},
            {"id": "security_emergency", "name": "Keamanan", "icon": "🚔", "color": "#2563eb"},
            {"id": "fire_emergency", "name": "Kebakaran", "icon": "🔥", "color": "#ea580c"},
            {"id": "natural_disaster", "name": "Bencana Alam", "icon": "🌊", "color": "#0891b2"},
            {"id": "vehicle_breakdown", "name": "Kendala Kendaraan", "icon": "🚗", "color": "#7c3aed"},
            {"id": "rescue_needed", "name": "Pencarian", "icon": "🔍", "color": "#059669"},
            {"id": "general_urgent", "name": "Umum", "icon": "⚠️", "color": "#ca8a04"}
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
            {"number": "119", "name": "Kementerian Kesehatan", "category": "medical"}
        ]
    }

# ============ DASHBOARD STATISTICS ============

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics for all emergencies"""
    total_emergencies = len(active_emergencies)
    
    # Count by category
    category_counts = {}
    status_counts = {"pending": 0, "responding": 0, "resolved": 0}
    
    # Location aggregation (by region - approximate)
    locations = []
    recent_emergencies = []
    
    for emergency_id, data in active_emergencies.items():
        category = data.get("category", "unknown")
        status = data.get("status", "pending")
        
        category_counts[category] = category_counts.get(category, 0) + 1
        status_counts[status] = status_counts.get(status, 0) + 1
        
        # Location data
        location = data.get("location")
        if location and location.get("lat") and location.get("lng"):
            locations.append({
                "lat": location["lat"],
                "lng": location["lng"],
                "emergency_id": emergency_id,
                "category": category,
                "status": status
            })
        
        # Recent emergencies (last 10)
        recent_emergencies.append({
            "emergency_id": emergency_id,
            "category": category,
            "urgency": data.get("urgency_level"),
            "status": status,
            "timestamp": data.get("timestamp"),
            "location": location
        })
    
    # Sort by timestamp (newest first)
    recent_emergencies.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    recent_emergencies = recent_emergencies[:10]  # Only last 10
    
    return {
        "total_emergencies": total_emergencies,
        "by_category": category_counts,
        "by_status": status_counts,
        "active_locations": locations,
        "recent_emergencies": recent_emergencies,
        "google_maps_enabled": GOOGLE_MAPS_ENABLED
    }

@app.get("/api/dashboard/locations")
async def get_all_locations():
    """Get all emergency locations for map display"""
    locations = []
    for emergency_id, data in active_emergencies.items():
        location = data.get("location")
        if location and location.get("lat") and location.get("lng"):
            locations.append({
                "id": emergency_id,
                "lat": location["lat"],
                "lng": location["lng"],
                "category": data.get("category"),
                "urgency": data.get("urgency_level"),
                "status": data.get("status"),
                "timestamp": data.get("timestamp"),
                "summary": data.get("summary", "")[:100] + "..." if len(data.get("summary", "")) > 100 else data.get("summary", "")
            })
    return {"locations": locations, "count": len(locations)}

# ============ WEBSOCKET ============

async def broadcast_message(message: dict):
    """Broadcast message ke semua connected clients"""
    disconnected = []
    for client_id, websocket in connected_clients.items():
        try:
            await websocket.send_json(message)
        except:
            disconnected.append(client_id)
    
    # Cleanup disconnected clients
    for client_id in disconnected:
        if client_id in connected_clients:
            del connected_clients[client_id]

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    connected_clients[client_id] = websocket
    
    await websocket.send_json({
        "type": "connected",
        "client_id": client_id,
        "message": "Connected to VibeLocal AI Real-Time System"
    })
    
    try:
        while True:
            data = await websocket.receive_json()
            
            # Handle different message types
            if data.get("type") == "subscribe_emergency":
                emergency_id = data.get("emergency_id")
                if emergency_id in active_emergencies:
                    await websocket.send_json({
                        "type": "emergency_data",
                        "data": active_emergencies[emergency_id]
                    })
                    
            elif data.get("type") == "location_update":
                # Handle real-time location from WebSocket
                emergency_id = data.get("emergency_id")
                lat = data.get("lat")
                lng = data.get("lng")
                
                if emergency_id in active_emergencies:
                    active_emergencies[emergency_id]["location_history"].append({
                        "lat": lat,
                        "lng": lng,
                        "timestamp": datetime.now().isoformat()
                    })
                    
                    # Broadcast ke semua clients yang subscribe emergency ini
                    await broadcast_message({
                        "type": "location_update",
                        "emergency_id": emergency_id,
                        "location": {"lat": lat, "lng": lng}
                    })
                    
            elif data.get("type") == "chat_message":
                emergency_id = data.get("emergency_id")
                message = data.get("message")
                sender = data.get("sender", "user")
                
                if emergency_id in active_emergencies:
                    msg_data = {
                        "sender": sender,
                        "message": message,
                        "timestamp": datetime.now().isoformat()
                    }
                    active_emergencies[emergency_id]["chat_history"].append(msg_data)
                    
                    await broadcast_message({
                        "type": "new_message",
                        "emergency_id": emergency_id,
                        "message": msg_data
                    })
                    
            elif data.get("type") == "ping":
                await websocket.send_json({"type": "pong", "timestamp": datetime.now().isoformat()})
                
    except WebSocketDisconnect:
        if client_id in connected_clients:
            del connected_clients[client_id]
    except Exception as e:
        print(f"WebSocket error: {e}")
        if client_id in connected_clients:
            del connected_clients[client_id]

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
