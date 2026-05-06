#!/usr/bin/env python3
"""
Script untuk menjalankan VibeLocal AI di local
Fitur Real-Time: WebSocket, GPS Tracking, Live Chat
"""

import subprocess
import sys
import os

def install_requirements():
    """Install dependencies"""
    print("📦 Installing dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt", "-q"])
    print("✅ Dependencies installed\n")

def run_server():
    """Run the FastAPI server"""
    print("🚀 Starting VibeLocal AI - Real-Time Emergency System")
    print("=" * 60)
    print("Local URL: http://localhost:8000")
    print("API Docs:   http://localhost:8000/docs")
    print("WebSocket:  ws://localhost:8000/ws/{client_id}")
    print("=" * 60)
    print("\nFitur Real-Time:")
    print("  📡 WebSocket Connection")
    print("  📍 GPS Live Tracking")
    print("  💬 Real-Time Chat")
    print("  🔄 Auto-reconnect")
    print("\nTekan Ctrl+C untuk berhenti\n")
    
    # Use uvicorn with reload for development
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "main_realtime:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload"
    ])

if __name__ == "__main__":
    try:
        # Check if dependencies need to be installed
        try:
            import fastapi
            import websockets
        except ImportError:
            install_requirements()
        
        run_server()
        
    except KeyboardInterrupt:
        print("\n\n👋 Server dihentikan. Sampai jumpa!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
