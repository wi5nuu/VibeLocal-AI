'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Send, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  AlertTriangle,
  HeartPulse,
  Car,
  Shield,
  Flame,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react'
import { analyzeEmergency, EmergencyResponse, EmergencyInput } from '@/components/api-client'

// Emergency categories
const categories = [
  { id: 'medical', name: 'Medical', icon: HeartPulse, color: 'from-red-500 to-red-600', urgency: 'high' },
  { id: 'vehicle', name: 'Vehicle', icon: Car, color: 'from-amber-500 to-orange-600', urgency: 'medium' },
  { id: 'security', name: 'Security', icon: Shield, color: 'from-blue-500 to-blue-600', urgency: 'high' },
  { id: 'fire', name: 'Fire', icon: Flame, color: 'from-orange-500 to-red-600', urgency: 'high' },
]

export default function AppPage() {
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [result, setResult] = useState<EmergencyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setIsAnalyzing(true)
    setShowResult(false)
    setError(null)
    
    try {
      // Get GPS location if available
      let location: { lat?: number; lng?: number } = {}
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          })
          location.lat = position.coords.latitude
          location.lng = position.coords.longitude
        } catch {
          // GPS not available, continue without location
        }
      }
      
      const response = await analyzeEmergency({
        user_input: input,
        ...location,
      })
      
      setResult(response)
      setShowResult(true)
    } catch (err) {
      setError('Gagal menganalisis. Pastikan backend berjalan di localhost:8000')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <main className={`min-h-screen bg-background transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-lg">VibeLocal</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link 
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Ceritakan Situasimu
            </h1>
            <p className="text-muted-foreground">
              AI akan menganalisis dan memberikan solusi terdekat
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Contoh: Ban motor bocor di jalan tol..."
                className="w-full px-6 py-5 pr-16 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isAnalyzing}
                className="absolute right-3 p-3 rounded-xl bg-foreground text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
              >
                {isAnalyzing ? (
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.form>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setInput(cat.name + ' emergency')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm"
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="font-medium">AI sedang menganalisis situasimu...</p>
                  <p className="text-sm text-muted-foreground">
                    Memahami konteks • Mencari solusi terdekat • Menyiapkan rekomendasi
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-600">Error</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Panel - Classification */}
                <div className="space-y-6">
                  {/* Classification Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-card rounded-2xl p-6 border shadow-sm ${
                      result.urgency_level === 'high' ? 'border-red-500/30' :
                      result.urgency_level === 'medium' ? 'border-amber-500/30' :
                      'border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ${
                        result.urgency_level === 'high' ? 'from-red-500 to-red-600' :
                        result.urgency_level === 'medium' ? 'from-amber-500 to-amber-600' :
                        'from-emerald-500 to-emerald-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold">{result.category.replace(/_/g, ' ').toUpperCase()}</h2>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${
                            result.urgency_level === 'high' ? 'bg-red-500' :
                            result.urgency_level === 'medium' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`} />
                          <span className="text-sm text-muted-foreground">
                            ID: {result.emergency_id} • Urgensi: <span className={`font-semibold uppercase ${
                              result.urgency_level === 'high' ? 'text-red-600' :
                              result.urgency_level === 'medium' ? 'text-amber-600' :
                              'text-emerald-600'
                            }`}>{result.urgency_level}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>
                    
                    {/* Urgency Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      result.urgency_level === 'high' ? 'bg-red-500/10 border-red-500/20' :
                      result.urgency_level === 'medium' ? 'bg-amber-500/10 border-amber-500/20' :
                      'bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        result.urgency_level === 'high' ? 'text-red-500' :
                        result.urgency_level === 'medium' ? 'text-amber-500' :
                        'text-emerald-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        result.urgency_level === 'high' ? 'text-red-600' :
                        result.urgency_level === 'medium' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {result.urgency_level === 'high' ? 'Butuh Perhatian Segera' :
                         result.urgency_level === 'medium' ? 'Perlu Perhatian' :
                         'Pantau Kondisi'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Action Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                      Saran Tindakan
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{result.emergency_action.suggested_step}</p>
                    <p className="text-sm font-medium text-amber-700">{result.emergency_action.call_to_action}</p>
                  </motion.div>

                  {/* Emergency Contact */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl p-6 border border-border"
                  >
                    <h3 className="font-semibold mb-4">Kontak Darurat</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                        <Phone className="w-4 h-4" />
                        112 (Umum)
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
                        <Phone className="w-4 h-4" />
                        119 (Medis)
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Right Panel - Recommendations */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Rekomendasi Terdekat
                  </h3>

                  {result.recommended_places.map((place, index) => (
                    <motion.div
                      key={place.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{place.name}</h4>
                          <p className="text-sm text-muted-foreground">{place.type} • {place.distance}</p>
                          <p className="text-xs text-muted-foreground mt-1 italic">{place.note}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          place.action === 'call' ? 'bg-red-500/10 text-red-600' :
                          place.action === 'navigate' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {place.action === 'call' ? 'Hubungi' :
                           place.action === 'navigate' ? 'Navigasi' : 'Chat'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {place.contact && place.action === 'call' && (
                          <a 
                            href={`tel:${place.contact}`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            {place.contact}
                          </a>
                        )}
                        {place.action === 'navigate' && (
                          <a 
                            href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                          >
                            <Navigation className="w-4 h-4" />
                            Navigasi
                          </a>
                        )}
                        {place.contact && place.action === 'whatsapp' && (
                          <a 
                            href={`https://wa.me/${place.contact.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* ETA Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600">
                      ETA ke lokasi terdekat: <span className="font-semibold">3-5 menit</span>
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
