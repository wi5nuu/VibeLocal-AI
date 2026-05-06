# VibeLocal Deploy Script for Google Cloud Run
# JuaraVibeCoding Submission

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

Write-Host "🚀 VibeLocal Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud --version 2>&1 | Select-String "Google Cloud SDK"
    if ($gcloudVersion) {
        Write-Host "✅ gcloud CLI detected" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ gcloud CLI not found. Please install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "Setting project to: $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Enable APIs
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
Start-Sleep -Seconds 2
gcloud services enable cloudbuild.googleapis.com
Start-Sleep -Seconds 2

# Deploy
Write-Host ""
Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan
gcloud builds submit --config cloudbuild.yaml

# Get URL
Write-Host ""
Write-Host "📋 Getting service URL..." -ForegroundColor Cyan
$serviceUrl = gcloud run services describe vibelocal-nextjs --region asia-southeast2 --format 'value(status.url)' 2>$null

if ($serviceUrl) {
    Write-Host ""
    Write-Host "✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📱 Landing Page: $serviceUrl" -ForegroundColor White
    Write-Host "🎯 App Dashboard: $serviceUrl/app" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 For #JuaraVibeCoding submission:" -ForegroundColor Yellow
    Write-Host "   1. Copy this URL: $serviceUrl" -ForegroundColor White
    Write-Host "   2. Fill the form: https://goo.gle/jvc_completion" -ForegroundColor White
    Write-Host "   3. Include your LinkedIn post URL" -ForegroundColor White
} else {
    Write-Host "⚠️ Could not retrieve service URL. Check status with:" -ForegroundColor Yellow
    Write-Host "   gcloud run services describe vibelocal-nextjs --region asia-southeast2" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Selamat! Aplikasi VibeLocal sudah live di Cloud Run!" -ForegroundColor Green
Write-Host "🇮🇩 JuaraVibeCoding #JuaraVibeCoding" -ForegroundColor Red
