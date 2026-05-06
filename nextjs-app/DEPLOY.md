# 🚀 Deploy VibeLocal ke Google Cloud Run

## Prerequisites

1. **Google Cloud Project** aktif dengan billing enabled
2. **Cloud Run API** dan **Cloud Build API** enabled
3. **gcloud CLI** terinstall dan authenticated

## Setup

### 1. Set Project
```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Deploy Methods

### Method 1: Cloud Build (Recommended)
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Method 2: Local Build + Push
```bash
# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/vibelocal-nextjs

# Deploy to Cloud Run
gcloud run deploy vibelocal-nextjs \
  --image gcr.io/PROJECT_ID/vibelocal-nextjs \
  --region asia-southeast2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1
```

### Method 3: Manual Docker Build
```bash
# Build locally
docker build -t gcr.io/PROJECT_ID/vibelocal-nextjs .

# Push to GCR
docker push gcr.io/PROJECT_ID/vibelocal-nextjs

# Deploy
gcloud run deploy vibelocal-nextjs \
  --image gcr.io/PROJECT_ID/vibelocal-nextjs \
  --region asia-southeast2 \
  --platform managed \
  --allow-unauthenticated
```

## Post-Deploy

### Get URL
```bash
gcloud run services describe vibelocal-nextjs --region asia-southeast2 --format 'value(status.url)'
```

### View Logs
```bash
gcloud logs tail --service=vibelocal-nextjs --region=asia-southeast2
```

### Update Service
```bash
gcloud run services update vibelocal-nextjs \
  --region asia-southeast2 \
  --memory 2Gi \
  --cpu 2
```

## Environment Variables (Optional)

```bash
gcloud run services update vibelocal-nextjs \
  --region asia-southeast2 \
  --set-env-vars API_URL=https://api.example.com
```

## #JuaraVibeCoding Submission

Setelah deploy berhasil:

1. **Get Cloud Run URL**: 
   ```bash
   gcloud run services describe vibelocal-nextjs --region asia-southeast2
   ```

2. **Isi Formulir**: https://goo.gle/jvc_completion
   - Link Cloud Run: `https://vibelocal-nextjs-xxxxx.a.run.app`
   - Link LinkedIn Post: (your post URL)

## Troubleshooting

### Build Fails
- Check `package.json` exists
- Ensure all dependencies listed
- Check Docker syntax: `docker build -t test .`

### Port Issues
- Cloud Run expects port 8080 (already configured in Dockerfile)

### Memory Issues
- Increase memory: `--memory 2Gi`

### Region
- Using `asia-southeast2` (Jakarta) for lowest latency in Indonesia

---

Selamat bersaing di #JuaraVibeCoding! 🇮🇩
