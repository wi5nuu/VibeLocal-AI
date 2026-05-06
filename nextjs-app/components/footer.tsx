'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-lg">VibeLocal</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              AI-powered emergency assistant yang memahami situasi darurat dan langsung memberikan solusi terdekat untuk 270 juta orang Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Try VibeLocal
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Emergency Numbers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 VibeLocal. Dibuat dengan{" "}
            <Heart className="w-4 h-4 inline text-red-500" /> untuk Indonesia.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Bagian dari</span>
            <span className="px-2 py-1 rounded bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-medium">
              #JuaraVibeCoding
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
