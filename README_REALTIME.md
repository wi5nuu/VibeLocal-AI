# 🚨 VibeLocal AI - Real-Time Edition 🇮🇩

**Indonesian Emergency Situation Intelligence System with Real-Time Features**

Sistem Darurat Lokal Indonesia dengan fitur **Real-Time**: WebSocket, GPS Tracking, dan Live Chat.

---

## ✨ Fitur Real-Time

| Fitur | Deskripsi |
|-------|-----------|
| 📡 **WebSocket** | Koneksi real-time dengan auto-reconnect |
| 📍 **GPS Live Tracking** | Tracking lokasi real-time setiap 5 detik |
| 💬 **Live Chat** | Komunikasi langsung dengan emergency responder |
| 🔄 **Auto-Reconnect** | WebSocket reconnect otomatis jika terputus |
| 📱 **Real-Time Status** | Status emergency update secara live |

---

## 🚀 Quick Start - Local Development

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Server (Otomatis)
```bash
python run_local.py
```

Atau manual:
```bash
uvicorn main_realtime:app --host 0.0.0.0 --port 8080 --reload
```

### 3. Buka Browser
```
http://localhost:8080
```

---

## 📡 WebSocket Endpoints

### Connect
```
ws://localhost:8080/ws/{client_id}
```

### Message Types

**Client → Server:**
```json
// Subscribe emergency
{
  "type": "subscribe_emergency",
  "emergency_id": "EMRG-ABC123"
}

// Send location
{
  "type": "location_update",
  "emergency_id": "EMRG-ABC123",
  "lat": -6.2088,
  "lng": 106.8456
}

// Send chat
{
  "type": "chat_message",
  "emergency_id": "EMRG-ABC123",
  "sender": "user",
  "message": "Butuh bantuan segera!"
}

// Keepalive
{
  "type": "ping"
}
```

**Server → Client:**
```json
// Location update broadcast
{
  "type": "location_update",
  "emergency_id": "EMRG-ABC123",
  "location": {"lat": -6.2088, "lng": 106.8456}
}

// New message
{
  "type": "new_message",
  "emergency_id": "EMRG-ABC123",
  "message": {
    "sender": "responder",
    "message": "Tim bantuan dalam perjalanan",
    "timestamp": "2026-05-06T14:30:00"
  }
}
```

---

## 📋 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/` | GET | UI Real-Time Emergency |
| `/analyze` | POST | Submit emergency + get ID |
| `/location/update` | POST | Update GPS location |
| `/emergency/{id}/status` | GET | Get real-time status |
| `/emergency/{id}/chat` | GET | Get chat history |
| `/emergency/{id}/chat` | POST | Send chat message |
| `/categories` | GET | List kategori |
| `/emergency-numbers` | GET | Nomor darurat |
| `/ws/{client_id}` | WS | WebSocket connection |

---

## 📝 Example Usage

### Submit Emergency
```bash
curl -X POST http://localhost:8080/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Motor mogok di tol",
    "location": "Jl. Sudirman, Jakarta",
    "lat": -6.2088,
    "lng": 106.8456
  }'
```

Response:
```json
{
  "emergency_id": "EMRG-A3F9B2C1",
  "category": "vehicle_breakdown",
  "urgency_level": "medium",
  "summary": "🚗 MASALAH KENDARAAN...",
  "timestamp": "2026-05-06T14:30:00",
  "location": {
    "lat": -6.2088,
    "lng": 106.8456,
    "address": "Jl. Sudirman, Jakarta"
  },
  ...
}
```

---

## ☁️ Deploy ke Google Cloud Run

### Prerequisites
- Google Cloud Project aktif
- Cloud Run API enabled
- gcloud CLI terinstall

### Step 1: Set Project
```bash
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Deploy via Cloud Build
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Step 3: Get URL
```bash
gcloud run services describe vibelocal-ai --region asia-southeast2
```

### Manual Deploy
```bash
# Build
gcloud builds submit --tag gcr.io/PROJECT_ID/vibelocal-ai

# Deploy
gcloud run deploy vibelocal-ai \
  --image gcr.io/PROJECT_ID/vibelocal-ai \
  --region asia-southeast2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --max-instances 10
```

---

## 🔧 File Structure

```
d:\VibeLocalAI\
├── main_realtime.py        # Backend FastAPI + WebSocket
├── index_realtime.html     # Frontend Real-Time UI
├── run_local.py            # Script run local (auto-install deps)
├── requirements.txt        # Dependencies
├── Dockerfile              # Container config
├── cloudbuild.yaml         # CI/CD Google Cloud
└── README_REALTIME.md      # Dokumentasi ini
```

---

## 📱 Cara Pakai (User)

1. **Buka aplikasi** di browser
2. **Klik "Submit Emergency & Connect"** untuk lapor darurat
3. **Klik "Start GPS Tracking"** untuk share lokasi real-time
4. **Chat via Live Chat** untuk komunikasi dengan responder
5. **Follow rekomendasi** yang muncul

---

## 🌐 Browser Support

- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Note:** GPS tracking memerlukan HTTPS di production (Google Cloud Run otomatis HTTPS).

---

## 🏆 #JuaraVibeCoding Submission Checklist

- [x] Fitur Real-Time (WebSocket)
- [x] GPS Tracking
- [x] Live Chat
- [x] Deploy ke Google Cloud Run
- [x] UI/UX Modern & Responsive
- [x] Emergency Classification AI
- [ ] Link Cloud Run (isi setelah deploy)
- [ ] Video Demo LinkedIn

---

**Dibuat untuk #JuaraVibeCoding 🇮🇩**

Powered by Google Cloud Run + FastAPI + WebSocket
