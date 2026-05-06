'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Brain, MapPin, Zap, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    title: 'User Input',
    description: 'Ceritakan situasimu dalam bahasa natural',
    example: '"Ban motor bocor di Sudirman"',
    color: 'bg-blue-500',
  },
  {
    icon: Brain,
    title: 'AI Understanding',
    description: 'AI menganalisis dan klasifikasikan situasi',
    example: 'Kendala Kendaraan • Urgensi: Medium',
    color: 'bg-violet-500',
  },
  {
    icon: MapPin,
    title: 'Nearby Solutions',
    description: 'Temukan bantuan terdekat dengan detail lengkap',
    example: '3 bengkel dalam radius 2km',
    color: 'bg-emerald-500',
  },
  {
    icon: Zap,
    title: 'One-Click Action',
    description: 'Hubungi, navigasi, atau alert kontak darurat',
    example: 'Panggilan langsung ke bengkel',
    color: 'bg-amber-500',
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-violet-500/5 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dari Kalimat{" "}
            <span className="gradient-text">ke Aksi dalam 5 Detik</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tidak perlu mencari-mencari. Cukup ceritakan apa yang terjadi, VibeLocal akan menangani sisanya.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="relative">
          {/* Connection line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 via-emerald-500 to-amber-500" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative z-10">
                  {/* Step number */}
                  <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-sm mb-4`}>
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${step.color}/10 flex items-center justify-center mb-4`}>
                    <step.icon className={`w-6 h-6 ${step.color.replace('bg-', 'text-')}`} />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                  {/* Example */}
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground font-mono">
                    {step.example}
                  </div>

                  {/* Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Speed indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 font-semibold">5 Detik</span>
            </div>
            <span className="text-muted-foreground">dari input ke solusi</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">⚡ Real-time processing</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
