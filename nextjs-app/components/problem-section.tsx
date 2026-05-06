'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, HeartPulse, Search, Clock } from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    title: 'Kecelakaan Motor',
    description: 'Ban bocor, mogok di jalan tol, atau kecelakaan. Waktu adalah nyawa saat kamu terjebak di lokasi berbahaya.',
    stat: '35%',
    statLabel: 'kecelakaan di Indonesia',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: HeartPulse,
    title: 'Sakit Mendadak',
    description: 'Pusing berat, sesak napas, atau gejala serius lainnya. Setiap detik berarti dalam kondisi medis darurat.',
    stat: '2.5jt',
    statLabel: 'kasus darurat medis/tahun',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Search,
    title: 'Kehilangan Barang',
    description: 'Dompet hilang, hp dicuri, atau barang berharga raib. Panik membuat sulit berpikir jernih untuk mencari solusi.',
    stat: '60%',
    statLabel: 'merasa panik & bingung',
    color: 'from-blue-500 to-blue-600',
  },
]

export function ProblemSection() {
  return (
    <section id="problems" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">Waktu adalah Nyawa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ketika Kamu Panik,{" "}
            <span className="text-muted-foreground">Kamu Tidak Punya Waktu untuk Mencari</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Situasi darurat membutuhkan respons cepat. Setiap menit yang terbuang mencari bantuan bisa berarti selisih antara selamat dan celaka.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-4`}>
                  <problem.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {problem.description}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}>
                      {problem.stat}
                    </span>
                    <span className="text-sm text-muted-foreground">{problem.statLabel}</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${problem.color} opacity-10 rounded-bl-full`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Bayangkan punya asisten yang selalu siap, memahami situasimu, dan langsung memberikan solusi terdekat.
          </p>
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 font-medium">Itulah VibeLocal</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
