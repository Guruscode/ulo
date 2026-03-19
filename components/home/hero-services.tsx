'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DollarSign, FileCheck, Building2 } from 'lucide-react'

const cards = [
  {
    title: 'Property Valuation',
    body: 'Get an accurate market valuation of your property from our experienced appraisers.',
    cta: 'Get Valuation',
    icon: DollarSign,
    href: '/services/property-valuation',
  },
  {
    title: 'Legal Documentation',
    body: 'Complete legal support including title verification and document preparation.',
    cta: 'Legal Services',
    icon: FileCheck,
    href: '/services/legal-documentation',
  },
  {
    title: 'Property Management',
    body: 'Full property management services including maintenance and tenant relations.',
    cta: 'Manage Property',
    icon: Building2,
    href: '/services/property-management',
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

