'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-red-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600">Emergency AI Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Ceritakan Situasimu.{" "}
              <span className="gradient-text-emergency">
                AI yang Akan Menyelamatkan Sisanya.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              VibeLocal memahami kondisi darurat dan langsung memberikan solusi 
              terdekat dalam hitungan detik. Dari kalimat sederhana ke aksi nyata.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/app"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:scale-[1.02]"
              >
                Try VibeLocal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border hover:bg-muted transition-all">
                <Play className="w-4 h-4" />
                See Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-background"
                    />
                  ))}
                </div>
                <span>270jt+ Indonesians</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-emerald-600 font-medium">✓ Available 24/7</span>
            </div>
          </motion.div>

          {/* Right - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            {/* Mock Chat Interface */}
            <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-sm text-muted-foreground">VibeLocal AI</span>
              </div>

              {/* Chat content */}
              <div className="p-4 space-y-4 min-h-[320px]">
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] bg-foreground text-background px-4 py-3 rounded-2xl rounded-tr-sm text-sm">
                    Ban motor bocor di Jl. Sudirman, tolong!
                  </div>
                </motion.div>

                {/* AI Response */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">V</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-3">
                        Menganalisis situasi... Terdeteksi: <span className="font-semibold text-amber-600">Kendala Kendaraan</span>
                      </p>

                      {/* Result Cards */}
                      <div className="space-y-2">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 }}
                          className="bg-muted/50 rounded-xl p-3 border border-border/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">Bengkel 24 Jam Terdekat</p>
                              <p className="text-xs text-muted-foreground">2.3 km • Buka 24 jam</p>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                              Tersedia
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium">
                              <Phone className="w-3 h-3" />
                              Hubungi
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                              <MapPin className="w-3 h-3" />
                              Navigasi
                            </button>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 }}
                          className="bg-muted/50 rounded-xl p-3 border border-border/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">Towing Service</p>
                              <p className="text-xs text-muted-foreground">4.1 km • Respon 15 menit</p>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                              Sibuk
                            </span>
                          </div>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors w-full justify-center">
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-card border border-border">
                  <input
                    type="text"
                    placeholder="Ceritakan situasimu..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    readOnly
                  />
                  <button className="p-2 rounded-full bg-foreground text-background">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-card rounded-xl p-3 shadow-lg border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">Lokasi Terdeteksi</p>
                  <p className="text-[10px] text-muted-foreground">Jl. Sudirman, Jakarta</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-card rounded-xl p-3 shadow-lg border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium">AI Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
