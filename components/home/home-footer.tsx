'use client'

import Link from 'next/link'
import { Landmark } from 'lucide-react'

export default function HomeFooter() {
  return (
    <footer className="bg-secondary text-white py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/listings" className="hover:text-white transition">For Sale</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">For Rent</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">Commercial</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">Land</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Landmark className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-serif font-bold">ULO</span>
          </div>
          <p>© {new Date().getFullYear()} ULO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
