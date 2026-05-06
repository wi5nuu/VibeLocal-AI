'use client'

import { motion } from 'framer-motion'
import { Brain, MapPin, Phone, Bell, Shield, Clock, Users, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Situation Understanding',
    description: 'Natural language processing yang memahami konteks darurat dalam bahasa Indonesia, slang, dan dialek lokal.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Instant Nearby Recommendations',
    description: 'GPS-powered search menemukan bantuan terdekat: bengkel, rumah sakit, polisi, damkar, dan lainnya.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Phone,
    title: 'One-Click Call / WhatsApp',
    description: 'Hubungi langsung dengan satu sentuhan. Tidak perlu mencari nomor atau buka aplikasi lain.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Bell,
    title: 'Emergency Contact Alert',
    description: 'Kirim lokasi dan status otomatis ke kontak darurat yang telah ditentukan sebelumnya.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Data lokasi dan informasi pribadi dienkripsi. Kamu kontrol penuh atas data yang dibagikan.',
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'AI tidak tidur. Siap membantu kapan saja, di mana saja, tanpa downtime.',
    color: 'from-indigo-500 to-blue-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-600">Powered by AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Fitur yang Dirancang untuk{" "}
            <span className="gradient-text">Menyelamatkan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap fitur dibuat dengan satu tujuan: membuat respons darurat lebih cepat, lebih mudah, dan lebih efektif.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 relative z-10`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 relative z-10">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '< 5s', label: 'Response Time' },
            { value: '50K+', label: 'Places Mapped' },
            { value: '270M', label: 'Indonesians Covered' },
            { value: '24/7', label: 'Always Available' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
