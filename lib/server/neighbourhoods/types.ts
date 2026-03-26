export interface NeighbourhoodPhase {
  name: string
  description: string
  image: string
}

export interface NeighbourhoodRecord {
  id: string
  slug: string
  name: string
  description: string
  fullDescription: string
  image: string
  latitude: string
  longitude: string
  amenities: string[]
  highlights: string[]
  population: string
  avgIncome: string
  avgAge: string
  phases: NeighbourhoodPhase[]
  createdAt: string
  updatedAt: string
}

export interface NeighbourhoodUpsertInput {
  slug: string
  name: string
  description: string
  fullDescription: string
  image: string
  latitude: string
  longitude: string
  amenities: string[]
  highlights: string[]
  population: string
  avgIncome: string
  avgAge: string
  phases: NeighbourhoodPhase[]
}
