'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomeFooter() {
  const handleOpenCookies = () => {
    window.dispatchEvent(new Event('open-cookie-banner'))
  }

  return (
    <footer className="bg-[#0f1724] px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
                  Stay connected
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  A footer built with the same language as the nav.
                </h2>
              </div>

              <div className="hidden items-center rounded-full border border-white/14 bg-white/8 px-3 py-3 backdrop-blur-xl lg:flex">
                <Link href="/listings" className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Properties
                </Link>
                <Link href="/hotels" className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Hotels
                </Link>
                <Link href="/agents" className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Agents
                </Link>
                <Link href="/help" className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Browse</h4>
              <ul className="space-y-3 text-sm text-white/72">
                <li><Link href="/listings" className="transition hover:text-white">For Sale</Link></li>
                <li><Link href="/listings" className="transition hover:text-white">For Rent</Link></li>
                <li><Link href="/shortlet" className="transition hover:text-white">Shortlet</Link></li>
                <li><Link href="/listings" className="transition hover:text-white">Land</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Company</h4>
              <ul className="space-y-3 text-sm text-white/72">
                <li><Link href="/about" className="transition hover:text-white">About</Link></li>
                <li><Link href="/blog" className="transition hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="transition hover:text-white">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Support</h4>
              <ul className="space-y-3 text-sm text-white/72">
                <li><Link href="/help" className="transition hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Legal</h4>
              <ul className="space-y-3 text-sm text-white/72">
                <li><Link href="/privacy" className="transition hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="transition hover:text-white">Terms</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={handleOpenCookies}
                    className="text-left transition hover:text-white"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-6 text-sm text-white/62 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-white.svg"
                alt="ULO"
                width={212}
                height={64}
                className="h-12 w-auto"
              />
            </div>
            <p>© {new Date().getFullYear()} ULO. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
