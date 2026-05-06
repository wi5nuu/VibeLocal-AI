# 🖥️ Local Development - Full Stack Real-Time

Jalankan **VibeLocal Full Stack** di local dengan Real-Time API + Next.js Frontend

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐
│  Next.js        │──────│  FastAPI         │
│  (Port 3000)    │      │  (Port 8000)     │
│                 │      │                  │
│  - Landing Page │      │  - AI Analysis   │
│  - Dashboard    │      │  - WebSocket     │
│  - Real-time UI │      │  - GPS Tracking  │
└─────────────────┘      └──────────────────┘
```

## 🚀 Quick Start

### Terminal 1 - Start Backend (FastAPI)
```bash
cd d:\VibeLocalAI
python run_local.py
```

### Terminal 2 - Start Frontend (Next.js)
```bash
cd d:\VibeLocalAI\nextjs-app
npm run dev
```

### Open Browser
- **Landing Page**: http://localhost:3000
- **App Dashboard**: http://localhost:3000/app
- **API Docs**: http://localhost:8000/docs

## 📋 Step-by-Step

### 1. Pastikan Dependencies Terinstall

**Backend:**
```bash
cd d:\VibeLocalAI
pip install fastapi uvicorn websockets python-multipart
```

**Frontend:**
```bash
cd d:\VibeLocalAI\nextjs-app
npm install
```

### 2. Jalankan Backend (FastAPI + WebSocket)

```bash
cd d:\VibeLocalAI
python run_local.py
```

Atau manual:
```bash
uvicorn main_realtime:app --host 0.0.0.0 --port 8000 --reload
```

✅ Backend akan jalan di: http://localhost:8000

### 3. Jalankan Frontend (Next.js)

**Buka terminal baru** (jangan tutup terminal backend):

```bash
cd d:\VibeLocalAI\nextjs-app
npm run dev
```

✅ Frontend akan jalan di: http://localhost:3000

### 4. Test Real-Time Features

1. Buka http://localhost:3000/app
2. Masukkan situasi darurat: `"Ban motor bocor di Sudirman"`
3. Click **"Analyze Situation"**
4. Aktifkan **"Start GPS Tracking"**
5. Buka chat dan kirim pesan

## 🔗 API Integration

Frontend otomatis proxy ke backend via `next.config.js`:

```javascript
// Next.js (Port 3000) → FastAPI (Port 8000)
'/api/analyze' → 'http://localhost:8000/analyze'
'/ws/client'   → 'ws://localhost:8000/ws/client'
```

## 📡 Real-Time Features Test

| Feature | URL | Status |
|---------|-----|--------|
| AI Analysis | http://localhost:3000/api/analyze | ✅ Working |
| WebSocket | ws://localhost:3000/ws/client | ✅ Working |
| GPS Tracking | Via WebSocket | ✅ Working |
| Live Chat | Via WebSocket | ✅ Working |

## 🐛 Troubleshooting

### Port 8000 Occupied
```bash
# Cek apa yang pakai port 8000
netstat -ano | findstr :8000

# Ganti port di backend
uvicorn main_realtime:app --host 0.0.0.0 --port 8001 --reload

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Port 3000 Occupied
```bash
# Jalankan di port lain
npm run dev -- --port 3001
```

### Backend Not Found
Pastikan FastAPI berjalan:
```bash
curl http://localhost:8000/api
# Should return: {"status": "active"}
```

### CORS Error
Sudah dihandle oleh Next.js proxy di `next.config.js`

## 🎯 Test Scenarios

### Scenario 1: Medical Emergency
1. Input: `"Saya pusing dan mual di kos"`
2. Expected: Medical classification + nearby clinics

### Scenario 2: Vehicle Breakdown
1. Input: `"Motor mogok di jalan tol"`
2. Expected: Vehicle category + repair shops

### Scenario 3: Real-Time GPS
1. Click "Start GPS Tracking"
2. Allow browser location permission
3. Watch coordinates update in real-time

### Scenario 4: Live Chat
1. Kirim pesan: `"Butuh bantuan segera"`
2. Tunggu auto-reply dari responder
3. Lihat typing indicator

## 🚀 Deploy ke Cloud Run (Setelah Test)

Setelah local test berhasil:

```bash
# Deploy script
cd d:\VibeLocalAI\nextjs-app
.\deploy.ps1 -ProjectId "your-project-id"
```

## 📞 Support

Jika ada issue:
1. Check backend logs: Terminal dengan `uvicorn`
2. Check frontend logs: Terminal dengan `npm run dev`
3. Pastikan both services running

Selamat testing! 🎉
