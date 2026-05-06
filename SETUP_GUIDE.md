# 🚀 VibeLocal AI - Complete Setup Guide

## 📋 Overview

VibeLocal sekarang mendukung **REAL-TIME DATA** dari Google Maps API:
- ✅ Pencarian tempat terdekat (RS, Bengkel, Polisi) real-time
- ✅ Navigasi Google Maps langsung dari lokasi user
- ✅ Dashboard statistik dengan monitoring lokasi
- ✅ UI Mobile-responsive (Android-friendly)
- ✅ Data bukan asal-isian, tapi dari Google Maps API

---

## 🔑 1. Setup Google Maps API Key

### Langkah 1: Buat API Key
1. Buka https://console.cloud.google.com/google/maps-apis
2. Buat project baru atau pilih project existing
3. Enable APIs berikut:
   - ✅ Places API
   - ✅ Distance Matrix API
   - ✅ Directions API (optional)
4. Buat API Key di "Credentials"
5. Copy API Key

### Langkah 2: Setup Environment Variables

**Backend (.env file):**
```bash
# Buat file .env di d:\VibeLocalAI
echo GOOGLE_MAPS_API_KEY=your_api_key_here > .env
```

**Atau PowerShell:**
```powershell
$env:GOOGLE_MAPS_API_KEY = "your_api_key_here"
```

### Langkah 3: Install Dependencies
```bash
cd d:\VibeLocalAI
pip install -r requirements.txt
```

---

## 🖥️ 2. Run Local Development

### Terminal 1 - Backend
```bash
cd d:\VibeLocalAI
python run_local.py
```

### Terminal 2 - Frontend
```bash
cd d:\VibeLocalAI\nextjs-app
npm run dev
```

### Buka Browser
- **Landing Page**: http://localhost:3000
- **Emergency App**: http://localhost:3000/app
- **Dashboard**: http://localhost:3000/dashboard
- **API Docs**: http://localhost:8000/docs

---

## 📱 3. Features Real-Time

### A. Emergency App (/app)
1. Izinkan browser akses **GPS location**
2. Ketik situasi darurat (contoh: "ban motor bocor")
3. Sistem akan:
   - ✅ Klasifikasi otomatis (Medical/Vehicle/Security/Fire)
   - ✅ Cari tempat terdekat via Google Maps API
   - ✅ Tampilkan jarak real (bukan asal)
   - ✅ Berikan navigasi Google Maps langsung
   - ✅ Nomor telepon real (jika tersedia di Google Maps)

### B. Dashboard (/dashboard)
- 📊 Statistik keadaan darurat per kategori
- 📍 Lokasi aktif pada peta
- ⏱️ Real-time update setiap 30 detik
- 📱 Mobile-responsive design

---

## 🗺️ 4. Google Maps Integration

### API Endpoints yang Menggunakan Google Maps:

| Endpoint | Fungsi |
|----------|--------|
| `POST /api/analyze` | Cari tempat terdekat berdasarkan kategori |
| `GET /api/dashboard/stats` | Statistik dengan lokasi aktif |
| `GET /api/dashboard/locations` | Semua lokasi untuk peta |

### Kategori Pencarian:

| Emergency Type | Google Maps Keyword |
|----------------|---------------------|
| Medical | hospital, klinik 24 jam, puskesmas |
| Vehicle | bengkel motor, bengkel mobil, tambal ban |
| Security | police station, kantor polisi |
| Fire | fire station, pemadam kebakaran |
| Natural Disaster | evacuation center, posko pengungsian |

---

## 📲 5. Mobile Android UI

### Mobile-Responsive Features:
- ✅ Touch-friendly buttons (min 44px)
- ✅ Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
- ✅ Sticky navigation bar
- ✅ Floating Action Button (FAB) untuk emergency
- ✅ Optimized font sizes untuk mobile
- ✅ Bottom sheet untuk mobile navigation

### Test di Mobile:
1. Buka Chrome DevTools (F12)
2. Pilih device mode (iPhone/Android)
3. Navigate ke http://localhost:3000/app
4. Test touch interactions

---

## ☁️ 6. Deploy ke Google Cloud Run

### Setup Environment Variables di Cloud Run:
```bash
# Set secret environment variable
gcloud run services update vibelocal-nextjs \
  --set-env-vars GOOGLE_MAPS_API_KEY=your_api_key_here \
  --region asia-southeast2
```

### Deploy:
```bash
cd d:\VibeLocalAI\nextjs-app
gcloud builds submit --config cloudbuild.yaml
```

### Verifikasi Deploy:
1. Buka URL Cloud Run
2. Test emergency input
3. Cek apakah Google Maps data muncul
4. Cek Dashboard stats

---

## 🧪 7. Testing Scenarios

### Test Case 1: Medical Emergency
```
Input: "Saya pusing dan mual di kos"
Expected: 
- Category: MEDICAL_EMERGENCY
- Places: RS terdekat dengan jarak real
- Navigate: Google Maps URL dengan koordinat
```

### Test Case 2: Vehicle Breakdown
```
Input: "Ban motor bocor di jalan tol"
Expected:
- Category: VEHICLE_BREAKDOWN
- Places: Bengkel terdekat dengan rating
- Jarak: Real dari GPS ke lokasi
```

### Test Case 3: GPS Enabled
```
1. Klik "Allow Location Access" di browser
2. Input apapun
3. Check: places harus punya lat/lng real
4. Navigate URL harus valid
```

---

## 🐛 8. Troubleshooting

### Google Maps API Error
```
Error: API key not valid
Solution: Pastikan API key benar dan APIs enabled
```

### No Places Found
```
Error: Places array empty
Solution: Koordinat GPS diperlukan untuk pencarian
```

### CORS Error
```
Error: CORS policy
Solution: CORS sudah di-enable di backend (allow_origins=["*"])
```

### GPS Not Working
```
1. Pastikan browser izinkan location
2. Check HTTPS (localhost OK, production WAJIB HTTPS)
3. Test dengan Chrome DevTools Geolocation override
```

---

## 📊 9. Dashboard Features

### Stats Available:
- Total emergencies
- Per category (Medical, Vehicle, Security, etc.)
- Per status (Pending, Responding, Resolved)
- Active locations count
- Recent 10 emergencies

### Map Integration:
- Klik lokasi → buka Google Maps
- Real-time coordinates
- Color-coded markers by category

---

## 🔐 10. Security Notes

### API Key Protection:
- ✅ Jangan commit API key ke GitHub
- ✅ Gunakan environment variables
- ✅ Restrict API key by HTTP referrer (production)
- ✅ Enable billing alerts di Google Cloud

### Environment Variables:
```bash
# Local development
.env file (sudah di .gitignore)

# Production (Cloud Run)
--set-env-vars atau --set-secrets
```

---

## ✅ 11. Checklist Sebelum Submit

- [ ] Google Maps API Key dibuat
- [ ] Backend jalan tanpa error
- [ ] Frontend connect ke backend
- [ ] Emergency input menghasilkan places real
- [ ] Navigasi Google Maps berfungsi
- [ ] Dashboard menampilkan stats
- [ ] UI mobile-responsive OK
- [ ] Deploy ke Cloud Run berhasil
- [ ] LinkedIn post dibuat
- [ ] Form #JuaraVibeCoding diisi

---

## 📞 12. Useful Links

- **Google Maps Console**: https://console.cloud.google.com/google/maps-apis
- **API Documentation**: https://developers.google.com/maps/documentation
- **Pricing**: https://cloud.google.com/maps-platform/pricing

---

**Selamat mencoba! 🚀**

Untuk bantuan, cek log backend dan browser console (F12).
