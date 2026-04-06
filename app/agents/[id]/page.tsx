'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ApiClientError } from '@/lib/client/api-error'
import { getAgentRequest } from '@/lib/client/users-client'
import type { AuthUser } from '@/lib/auth/types'

const DEFAULT_AGENT_IMAGE = '/brand/favicon-black.png'

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [agent, setAgent] = useState<AuthUser | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAgentRequest(id)
        setAgent(response.agent)
      } catch (error) {
        setError(error instanceof ApiClientError ? error.message : 'Unable to load agent.')
      }
    }
    void load()
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <HomeNav />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <section className="bg-gradient-to-br from-secondary/10 via-background to-secondary/5 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/agents" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <Card className="flex items-center justify-center p-10">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-secondary/10 ring-4 ring-secondary/10">
              <Image
                src={agent.profileImageUrl || DEFAULT_AGENT_IMAGE}
                alt={agent.name}
                fill
                className={agent.profileImageUrl ? 'object-cover' : 'object-contain p-5'}
                sizes="160px"
              />
            </div>
          </Card>

          <Card className="space-y-6 p-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-secondary">{agent.name}</h1>
              <p className="mt-2 capitalize text-foreground/70">{agent.accountType?.replace('_', ' ')}</p>
            </div>
            <div className="space-y-3 text-foreground/70">
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-secondary" />{agent.address || 'Address not provided'}{agent.state ? `, ${agent.state}` : ''}{agent.localGovernment ? `, ${agent.localGovernment}` : ''}</div>
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-secondary" /><a href={`tel:${agent.phone}`}>{agent.phone}</a></div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-secondary" /><a href={`mailto:${agent.email}`}>{agent.email}</a></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Card className="p-4"><p className="text-foreground/60">Approval</p><p className="font-semibold text-secondary">{agent.approvalStatus}</p></Card>
              <Card className="p-4"><p className="text-foreground/60">Status</p><p className="font-semibold text-secondary">{agent.status}</p></Card>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${agent.email}`} className="flex-1"><Button className="w-full bg-secondary text-white hover:bg-secondary/90">Email Agent</Button></a>
              <a href={`tel:${agent.phone}`} className="flex-1"><Button variant="outline" className="w-full">Call Agent</Button></a>
            </div>
          </Card>
        </div>
      </section>
      <HomeFooter />
    </div>
  )
}
