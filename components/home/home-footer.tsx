'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HomeFooter() {
  const handleOpenCookies = () => {
    window.dispatchEvent(new Event('open-cookie-banner'))
  }

  return (
    <footer className="bg-secondary text-white py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/listings" className="hover:text-white transition">For Sale</Link></li>
              <li><Link href="/listings" className="hover:text-white transition">For Rent</Link></li>
              <li><Link href="/shortlet" className="hover:text-white transition">Shortlet</Link></li>
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
              <li><button type="button" onClick={handleOpenCookies} className="hover:text-white transition text-left">Cookies</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <div className="ml-2 sm:ml-4 flex items-center gap-3">
            <Image
              src="/logo-transperient.png"
              alt="ULO"
              width={212}
              height={64}
              className="h-14 w-auto"
            />
          </div>
          <p>© {new Date().getFullYear()} ULO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
