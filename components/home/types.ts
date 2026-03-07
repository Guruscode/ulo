export type Property = {
  id: number
  title: string
  location: string
  price: string
  priceValue: number
  currency: 'USD' | 'NGN'
  bedrooms: number
  bathrooms: number
  sqft: string
  image: string
  type: string
  listedBy: 'Agent' | 'Landlord'
  views?: number
  badges?: string[]
  originalPrice?: string
  discount?: string
  estate?: string
}

export type Estate = {
  name: string
  slug: string
  image: string
  location: string
}

export type QuickType = 'All' | 'Buy' | 'Sell' | 'Rent' | 'Shortlet'
export type CurrencyFilter = 'Any' | 'USD' | 'NGN'
