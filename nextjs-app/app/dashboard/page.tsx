'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  BarChart3, 
  MapPin, 
  AlertTriangle,
  Activity,
  Users,
  Clock,
  Phone,
  Navigation,
  Filter,
  ChevronRight
} from 'lucide-react'

interface Emergency {
  id: string
  category: string
  urgency: string
  status: string
  lat: number
  lng: number
  timestamp: string
  summary?: string
}

interface Stats {
  total_emergencies: number
  by_category: Record<string, number>
  by_status: Record<string, number>
  active_locations: Emergency[]
  recent_emergencies: any[]
}

const CATEGORY_COLORS: Record<string, string> = {
  medical_emergency: 'bg-red-500',
  security_emergency: 'bg-blue-500',
  fire_emergency: 'bg-orange-500',
  natural_disaster: 'bg-cyan-500',
  vehicle_breakdown: 'bg-violet-500',
  rescue_needed: 'bg-emerald-500',
  general_urgent: 'bg-amber-500'
}

const CATEGORY_NAMES: Record<string, string> = {
  medical_emergency: 'Medis',
  security_emergency: 'Keamanan',
  fire_emergency: 'Kebakaran',
  natural_disaster: 'Bencana',
  vehicle_breakdown: 'Kendaraan',
  rescue_needed: 'Pencarian',
  general_urgent: 'Umum'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="font-semibold text-lg">VibeLocal Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/app"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                + Emergency Baru
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Title - Desktop */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold">Emergency Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring dan statistik keadaan darurat
          </p>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden py-4">
          <h1 className="text-xl font-bold">Emergency Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {stats?.total_emergencies || 0} keadaan darurat tercatat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-violet-500" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats?.total_emergencies || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats?.by_status?.pending || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">Responding</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats?.by_status?.responding || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">Lokasi Aktif</span>
            </div>
            <p className="text-xl md:text-2xl font-bold">{stats?.active_locations?.length || 0}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Category Distribution */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm md:text-base">Distribusi Kategori</h3>
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
            
            {stats?.by_category && Object.entries(stats.by_category).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.by_category).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs md:text-sm">{CATEGORY_NAMES[category] || category}</span>
                        <span className="text-xs md:text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-500'}`}
                          style={{ width: `${(count / stats.total_emergencies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada data keadaan darurat
              </p>
            )}
          </motion.div>

          {/* Recent Emergencies */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm md:text-base">Keadaan Darurat Terbaru</h3>
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {stats?.recent_emergencies && stats.recent_emergencies.length > 0 ? (
                stats.recent_emergencies.map((emergency: any) => (
                  <div 
                    key={emergency.emergency_id}
                    className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[emergency.category] || 'bg-gray-500'}`} />
                          <span className="font-medium text-xs md:text-sm">
                            {CATEGORY_NAMES[emergency.category] || emergency.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs ${
                            emergency.urgency === 'high' ? 'bg-red-500/10 text-red-600' :
                            emergency.urgency === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {emergency.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {emergency.emergency_id}
                        </p>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        {new Date(emergency.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada keadaan darurat tercatat
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Active Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 md:mt-8 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm md:text-base">Lokasi Aktif ({stats?.active_locations?.length || 0})</h3>
            <Navigation className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
          </div>
          
          {stats?.active_locations && stats.active_locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.active_locations.slice(0, 6).map((location: any, index: number) => (
                <a
                  key={index}
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs md:text-sm truncate">{location.emergency_id}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                  <Navigation className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Belum ada lokasi aktif yang dilaporkan
            </p>
          )}
        </motion.div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link 
          href="/app"
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Phone className="w-6 h-6" />
        </Link>
      </div>
    </main>
  )
}
