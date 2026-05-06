# 🖥️ Run VibeLocal Real-Time di Local

## 🚀 Quick Start (2 Terminal)

### Terminal 1 - Backend (FastAPI + WebSocket)
```bash
cd d:\VibeLocalAI
python run_local.py
```
✅ Akan jalan di: http://localhost:8000

### Terminal 2 - Frontend (Next.js)
```bash
cd d:\VibeLocalAI\nextjs-app
npm run dev
```
✅ Akan jalan di: http://localhost:3000

---

## 🧪 Test Real-Time Features

### 1. Browser - Landing Page
Buka: http://localhost:3000
- Lihat animasi hero section
- Scroll ke demo section

### 2. Browser - App Dashboard  
Buka: http://localhost:3000/app
- Ketik: `"Ban motor bocor di Sudirman"`
- Click **"Analyze Situation"**
- ✅ AI akan analyze via API localhost:8000

### 3. Test dengan Real API
Input apa saja, contoh:
- `"Saya pusing banget di kos"` → Medical
- `"Motor mogok di tol"` → Vehicle
- `"Ada kebakaran di rumah"` → Fire
- `"Tersesat di hutan"` → Rescue

### 4. Check API Docs
Buka: http://localhost:8000/docs
- Swagger UI untuk test API langsung

---

## 🔌 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| FastAPI Backend | 8000 | http://localhost:8000 |
| Next.js Frontend | 3000 | http://localhost:3000 |
| API Docs | 8000 | http://localhost:8000/docs |

Frontend otomatis proxy API calls ke backend via `next.config.js`

---

## 🐛 Troubleshooting

### Error: Cannot connect to backend
```
Pastikan backend jalan dulu di terminal 1:
cd d:\VibeLocalAI
python run_local.py
```

### Port 8000 sudah dipakai
```bash
# Cek process
netstat -ano | findstr :8000

# Ganti port di backend (misal ke 8001)
# Edit run_local.py port 8000 → 8001
# Edit nextjs-app/.env.local port 8000 → 8001
```

### npm install error
```bash
cd d:\VibeLocalAI\nextjs-app
npm install --force
```

---

## ✅ Working Features

- [x] Landing Page (Next.js)
- [x] App Dashboard (Next.js)
- [x] AI Analysis API (FastAPI)
- [x] Emergency Classification
- [x] Nearby Place Recommendations
- [x] Click-to-Call buttons
- [x] Navigation links
- [x] WhatsApp integration
- [x] Error handling
- [ ] WebSocket Real-time (perlu test manual)
- [ ] GPS Tracking (perlu browser permission)

---

## 🎉 Selanjutnya - Deploy ke Cloud Run

Setelah local test berhasil:

```powershell
cd d:\VibeLocalAI\nextjs-app
.\deploy.ps1 -ProjectId "your-gcp-project-id"
```

Atau manual:
```bash
gcloud builds submit --config cloudbuild.yaml
```

---

Selamat mencoba! 🚀
