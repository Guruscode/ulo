'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, KeyRound, BadgeDollarSign } from 'lucide-react'

const cards = [
  {
    title: 'Buy a home',
    body: 'A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.',
    cta: 'Find a local agent',
    icon: Home,
    href: '/buy',
  },
  {
    title: 'Rent a home',
    body: 'We are creating a seamless online experience from shopping, to applying, to paying rent.',
    cta: 'Find rentals',
    icon: KeyRound,
    href: '/rent',
  },
  {
    title: 'Sell a home',
    body: 'No matter what path you take to sell your home, we can help you navigate a successful sale.',
    cta: 'See your options',
    icon: BadgeDollarSign,
    href: '/sell',
  },
]

export default function HeroServices() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ title, body, cta, icon: Icon, href }) => (
            <div
              key={title}
              className="rounded-3xl bg-white border border-foreground/10 shadow-[0_12px_30px_rgba(15,23,42,0.08)] p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="h-20 w-20 rounded-full bg-foreground/5 flex items-center justify-center">
                <Icon className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
              <p className="text-foreground/60">{body}</p>
              <Link href={href} className="w-full">
                <Button className="rounded-full border border-foreground/20 bg-white text-foreground hover:bg-foreground/5 w-full">
                  {cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
