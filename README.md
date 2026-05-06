# VibeLocal AI 🇮🇩

**Indonesian Emergency Situation Intelligence System** - JuaraVibeCoding Submission

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://vibelocal-ai-xxxxx.a.run.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Realtime-teal)](https://fastapi.tiangolo.com/)
[![Google Cloud Run](https://img.shields.io/badge/Cloud-Run-blue)](https://cloud.google.com/run)

## 🎯 About

VibeLocal adalah **AI Emergency Assistant** yang membantu warga Indonesia mendapatkan bantuan darurat dengan cepat dan efisien. Sistem ini menganalisis situasi darurat, mengklasifikasikan urgensi, dan memberikan rekomendasi tempat terdekat yang dapat membantu.

## 🚀 Features

### Real-Time Emergency Intelligence
- ✅ **AI-Powered Classification** - Deteksi otomatis kategori darurat (Medical, Vehicle, Security, Fire, dll)
- ✅ **Smart Recommendations** - Rekomendasi tempat terdekat dengan jarak & kontak
- ✅ **One-Click Actions** - Hubungi langsung via telepon/WhatsApp atau navigasi ke Google Maps
- ✅ **GPS Live Tracking** - Pantau lokasi user real-time untuk responder
- ✅ **WebSocket Chat** - Komunikasi real-time dengan tim bantuan

### Modern UI/UX
- 🎨 **Vercel/Linear Design** - Silicon Valley-grade interface
- 📱 **Responsive** - Works on desktop & mobile
- 🌓 **Dark Mode** - Auto light/dark theme support
- ✨ **Framer Motion** - Smooth animations

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐
│   Next.js 14    │──────│   FastAPI        │
│   (Frontend)    │      │   (Backend)    │
│                 │      │                 │
│  • Landing Page │      │  • AI Analysis  │
│  • Dashboard    │      │  • WebSocket    │
│  • Real-time UI │      │  • GPS Tracking │
└─────────────────┘      └──────────────────┘
         │                          │
         └──────────┬─────────────┘
                    │
            Google Cloud Run
```

## 🛠️ Tech Stack

### Frontend
- [Next.js 14](https://nextjs.org/) - React Framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - Python API Framework
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time communication
- [Google Cloud Run](https://cloud.google.com/run) - Serverless deployment

## 📁 Project Structure

```
VibeLocalAI/
├── nextjs-app/              # Next.js Frontend
│   ├── app/                 # App Router (pages)
│   │   ├── page.tsx         # Landing Page
│   │   └── app/page.tsx     # Dashboard
│   ├── components/          # React Components
│   ├── Dockerfile           # Container config
│   └── cloudbuild.yaml      # CI/CD pipeline
│
├── main_realtime.py         # FastAPI Backend
├── index_realtime.html      # Static HTML fallback
├── run_local.py            # Local dev script
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Local Development

**1. Clone Repository**
```bash
git clone https://github.com/wi5nuu/VibeLocal-AI.git
cd VibeLocal-AI
```

**2. Setup Backend**
```bash
pip install -r requirements.txt
python run_local.py
# Backend runs at http://localhost:8000
```

**3. Setup Frontend**
```bash
cd nextjs-app
npm install
npm run dev
# Frontend runs at http://localhost:3000
```

**4. Open Browser**
- Landing Page: http://localhost:3000
- Dashboard: http://localhost:3000/app
- API Docs: http://localhost:8000/docs

### Deploy to Google Cloud Run

```bash
cd nextjs-app
gcloud builds submit --config cloudbuild.yaml
```

## 🎥 Demo

### Emergency Scenarios

| Input | Category | Result |
|-------|----------|--------|
| `"Ban motor bocor di tol"` | Vehicle | Bengkel terdekat |
| `"Saya pusing di kos"` | Medical | Klinik 24 jam |
| `"Ada kebakaran"` | Fire | Pemadam kebakaran |
| `"Maling masuk rumah"` | Security | Polisi terdekat |

## 🏆 JuaraVibeCoding Submission

- **Repository**: https://github.com/wi5nuu/VibeLocal-AI
- **LinkedIn**: https://www.linkedin.com/in/wisnu-alfian-nur-ashar
- **Hashtag**: #JuaraVibeCoding

## 📝 API Endpoints

### Analyze Emergency
```bash
POST /api/analyze
Content-Type: application/json

{
  "user_input": "Ban motor bocor",
  "lat": -6.2088,
  "lng": 106.8456
}
```

### WebSocket Connection
```javascript
ws://your-domain.com/ws/{client_id}
```

## 🤝 Contributing

This project is built for #JuaraVibeCoding competition. Feel free to fork and improve!

## 📄 License

MIT License - Free for personal and commercial use.

---

**Built with ❤️ in Indonesia for Indonesia**

🇮🇩 #JuaraVibeCoding
