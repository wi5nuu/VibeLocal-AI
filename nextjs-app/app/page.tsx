import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { ProblemSection } from '@/components/problem-section'
import { SolutionSection } from '@/components/solution-section'
import { FeaturesSection } from '@/components/features-section'
import { DemoSection } from '@/components/demo-section'
import { Footer } from '@/components/footer'
import { ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <HeroSection />
      
      <ProblemSection />
      
      <SolutionSection />
      
      <FeaturesSection />
      
      <DemoSection />
      
      {/* Impact Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-blue-500/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">For Everyone</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Dirancang untuk{" "}
              <span className="gradient-text">270 Juta Orang Indonesia</span>{" "}
              dalam Situasi Darurat
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Dari pelajar di kos-kosan, pengemudi ojek online, hingga ibu rumah tangga di rumah. 
              VibeLocal siap membantu siapa saja, kapan saja, di mana saja.
            </p>
            
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:scale-[1.02]"
            >
              Start Using VibeLocal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
