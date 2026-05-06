# VibeLocal AI 🇮🇩

**Indonesian Emergency Situation Intelligence System**

Sistem Klasifikasi dan Respons Darurat Lokal Indonesia yang memberikan informasi lokasi bantuan terdekat dan langkah-langkah darurat yang tepat.

## Fitur

- 📍 **Klasifikasi Cerdas** - Menganalisis input pengguna untuk mengidentifikasi jenis darurat
- 🏥 **Lokasi Bantuan Terdekat** - Rekomendasi RS, Polsek, Damkar, dll dengan aksi call/navigate
- 📱 **Aksi Langsung** - Tombol call, whatsapp, dan navigate untuk respons cepat
- 🚨 **Level Urgensi** - Prioritas high/medium/low untuk penanganan yang tepat

## API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/` | GET | Health check |
| `/analyze` | POST | Analisis situasi darurat |
| `/categories` | GET | Daftar kategori darurat |
| `/emergency-numbers` | GET | Nomor darurat Indonesia |

## Contoh Request

```bash
curl -X POST https://your-app-url/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Motor mogok di jalan raya",
    "location": "Jl. Sudirman, Jakarta"
  }'
```

## Response Format

```json
{
  "category": "vehicle_breakdown",
  "urgency_level": "medium",
  "summary": "Terdeteksi MASALAH KENDARAAN...",
  "recommended_places": [
    {
      "name": "Bengkel 24 Jam Terdekat",
      "type": "Bengkel",
      "distance": "2km",
      "action": "navigate",
      "contact": "082134567890",
      "note": "Towing dan perbaikan darurat kendaraan"
    }
  ],
  "emergency_action": {
    "suggested_step": "Aktifkan lampu hazard...",
    "call_to_action": "Hubungi bengkel 24 jam...",
    "share_location_message": "Kendaraan mogok! Butuh bantuan..."
  }
}
```

## Deploy ke Google Cloud Run

### Opsi 1: Cloud Build (Git)

```bash
gcloud builds submit --config cloudbuild.yaml
```

### Opsi 2: Deploy Langsung

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/vibelocal-ai

# Deploy
gcloud run deploy vibelocal-ai \
  --image gcr.io/PROJECT_ID/vibelocal-ai \
  --region asia-southeast2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

### Opsi 3: Local Build + Push

```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/vibelocal-ai .

# Push ke GCR
docker push gcr.io/PROJECT_ID/vibelocal-ai

# Deploy
gcloud run deploy vibelocal-ai \
  --image gcr.io/PROJECT_ID/vibelocal-ai \
  --region asia-southeast2 \
  --platform managed \
  --allow-unauthenticated
```

## Requirements

- Google Cloud Project dengan Cloud Run API enabled
- Google Cloud SDK (gcloud CLI)
- Docker (opsional untuk local build)

## Kategori Darurat

1. **Medical Emergency** (🏥) - Sakit, cedera, kecelakaan
2. **Security** (🚔) - Begal, copet, kejahatan
3. **Fire** (🔥) - Kebakaran, gas bocor
4. **Natural Disaster** (🌊) - Banjir, gempa, tsunami
5. **Vehicle Breakdown** (🚗) - Mogok, ban bocor
6. **Rescue** (🔍) - Tersesat, orang hilang

## Nomor Darurat Indonesia

- 112 - Nomor Darurat Terpadu
- 110 - Polisi
- 113 - Pemadam Kebakaran
- 115 - Basarnas/SAR
- 117 - BPBD
- 118 - Ambulans
- 119 - Kementerian Kesehatan

---

**Dibuat untuk #JuaraVibeCoding 🇮🇩**
