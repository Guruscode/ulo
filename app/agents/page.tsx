'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Search, UserPlus } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ApiClientError } from '@/lib/client/api-error'
import { listAgentsRequest } from '@/lib/client/users-client'
import type { AuthUser } from '@/lib/auth/types'

export default function AgentsPage() {
  const [agents, setAgents] = useState<AuthUser[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await listAgentsRequest()
        setAgents(response.agents)
      } catch (error) {
        setError(error instanceof ApiClientError ? error.message : 'Unable to load agents.')
      }
    }
    void load()
  }, [])

  const filteredAgents = useMemo(
    () =>
      agents.filter((agent) =>
        `${agent.name} ${agent.state || ''} ${agent.localGovernment || ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [agents, search]
  )

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <section className="bg-gradient-to-br from-secondary/10 via-background to-secondary/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-serif font-bold text-secondary">Approved Agents</h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-foreground/70">Browse verified agents on ULO and contact them directly.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-foreground/40" />
            <Input className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or state..." />
          </div>
          <Link href="/signup">
            <Button className="bg-secondary text-white hover:bg-secondary/90"><UserPlus className="mr-2 h-4 w-4" />Register as Agent</Button>
          </Link>
        </div>

        {error ? <Card className="mt-6 p-8 text-center text-red-600">{error}</Card> : null}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredAgents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <Card className="h-full p-5 transition-shadow hover:shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-xl font-bold text-secondary">
                  {agent.name.charAt(0)}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-secondary">{agent.name}</h3>
                  <p className="text-sm capitalize text-foreground/60">{agent.accountType?.replace('_', ' ')}</p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-foreground/70">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{agent.state || 'Nigeria'}{agent.localGovernment ? `, ${agent.localGovernment}` : ''}</div>
                  <p>{agent.phone || 'No phone listed'}</p>
                  <p>{agent.email}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <HomeFooter />
    </div>
  )
}
