'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Phone, MessageCircle, Navigation, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { analyzeEmergency, EmergencyResponse, EmergencyInput } from './api-client'

const exampleInputs = [
  'Aku pusing banget di kos',
  'Ban motor bocor di tol',
  'Anakku demam tinggi',
  'Dompet hilang di mall',
]

// Emergency numbers
const EMERGENCY_NUMBERS = {
  '112': 'Nomor Darurat Terpadu',
  '119': 'Kementerian Kesehatan',
  '110': 'Polisi',
  '113': 'Pemadam Kebakaran',
}

export function DemoSection() {
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
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

  return (
    <section id="demo" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-violet-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Coba Sekarang{" "}
            <span className="gradient-text">Gratis</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ketik situasimu dan lihat bagaimana VibeLocal memberikan solusi dalam hitungan detik.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">VibeLocal AI Demo</span>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Input */}
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ceritakan situasimu..."
                    className="w-full px-5 py-4 pr-14 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isAnalyzing}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-foreground text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
                  >
                    {isAnalyzing ? (
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Example chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {exampleInputs.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setInput(example)}
                      className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </form>

              {/* Loading State */}
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-red-600">Error</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">AI sedang menganalisis...</p>
                        <p className="text-sm text-muted-foreground">
                          Memahami situasi • Mencari solusi terdekat • Menyiapkan rekomendasi
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {showResult && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Classification */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                      result.urgency_level === 'high' 
                        ? 'bg-red-500/5 border-red-500/20' 
                        : result.urgency_level === 'medium'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        result.urgency_level === 'high' ? 'bg-red-500' : 
                        result.urgency_level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          result.urgency_level === 'high' ? 'text-red-600' :
                          result.urgency_level === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{result.category.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {result.emergency_id} • Urgensi: <span className="font-semibold uppercase">{result.urgency_level}</span>
                        </p>
                      </div>
                      <div className="ml-auto">
                        <CheckCircle2 className={`w-5 h-5 ${
                          result.urgency_level === 'high' ? 'text-red-500' :
                          result.urgency_level === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                        }`} />
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-muted-foreground">{result.summary}</p>

                    {/* Places */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Rekomendasi Terdekat:</p>
                      {result.recommended_places.map((place, index) => (
                        <motion.div
                          key={place.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{place.name}</p>
                              <p className="text-xs text-muted-foreground">{place.type} • {place.distance}</p>
                              <p className="text-xs text-muted-foreground mt-1 italic">{place.note}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              place.action === 'call' ? 'bg-red-500/10 text-red-600' :
                              place.action === 'navigate' ? 'bg-blue-500/10 text-blue-600' :
                              'bg-emerald-500/10 text-emerald-600'
                            }`}>
                              {place.action === 'call' ? 'Hubungi' :
                               place.action === 'navigate' ? 'Navigasi' : 'Chat'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {place.contact && (
                              <a 
                                href={`tel:${place.contact}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                {place.contact}
                              </a>
                            )}
                            {place.action === 'navigate' && (
                              <a 
                                href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors"
                              >
                                <Navigation className="w-3 h-3" />
                                Navigasi
                              </a>
                            )}
                            {place.action === 'whatsapp' && (
                              <a 
                                href={`https://wa.me/${place.contact.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-sm">
                        <span className="font-medium text-amber-600">Saran Tindakan: </span>
                        {result.emergency_action.suggested_step}
                      </p>
                      <p className="text-sm mt-2 text-amber-700">
                        {result.emergency_action.call_to_action}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Speed badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-600">
                Average response time: <span className="font-semibold">3.2 seconds</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
