import type { NeighbourhoodUpsertInput } from './types'

export const seededNeighbourhoods: NeighbourhoodUpsertInput[] = [
  {
    slug: 'lagos',
    name: 'Lagos',
    description: "Nigeria's largest and most vibrant city",
    fullDescription:
      "Lagos is Nigeria's largest and most vibrant city, known for its bustling commercial activity, beautiful beaches, and diverse population. It serves as the economic powerhouse of Nigeria with world-class amenities, vibrant nightlife, and numerous investment opportunities. The city offers a perfect blend of modern infrastructure and traditional culture.",
    latitude: `6° 27' 4.104" N`,
    longitude: `3° 23' 18.24" E`,
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80',
    amenities: ['Shopping Malls', 'Fine Dining', 'Beaches', 'Golf Courses', 'Hospitals', 'Universities', 'International Schools'],
    highlights: ['Lekki Peninsula Development', 'Victoria Island Commercial Hub', 'Ikoyi Residential District', 'Island Lifestyle'],
    population: '15+ Million',
    avgIncome: 'High',
    avgAge: '28-35 years',
    phases: [],
  },
  {
    slug: 'abuja',
    name: 'Abuja',
    description: "Nigeria's federal capital with modern infrastructure",
    fullDescription:
      'Abuja is the capital city of Nigeria, located in the central part of the country. The city is known for its modern infrastructure, wide streets, and prominent landmarks, including the National Mosque, the National Christian Centre, and Aso Rock.',
    latitude: `9° 4' 35.3244" N`,
    longitude: `7° 23' 54.8664" E`,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    amenities: ['Government Offices', 'Shopping Centers', 'Parks', 'International Hotels', 'Hospitals', 'Private Schools', 'Entertainment Venues'],
    highlights: ['Planned City Layout', 'Aso Rock Monument', 'Federal Government Area', 'Growing Real Estate Market'],
    population: '3+ Million',
    avgIncome: 'Middle to High',
    avgAge: '25-40 years',
    phases: [
      {
        name: 'Phase 1',
        description: 'Initial development area with government structures and commercial establishments.',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80',
      },
      {
        name: 'Phase 2',
        description: 'Expanded residential and commercial zones with modern amenities.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80',
      },
    ],
  },
  {
    slug: 'port-harcourt',
    name: 'Port Harcourt',
    description: 'Major oil and gas hub on the Niger Delta',
    fullDescription:
      "Port Harcourt is the capital of Rivers State and serves as a major hub for Nigeria's oil and gas industry. It is a crucial port city with significant economic importance, modern estates, and a growing mix of local and international businesses.",
    latitude: `4° 46' 17.364" N`,
    longitude: `7° 0' 51.66" E`,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80',
    amenities: ['Port Facilities', 'Oil & Gas Companies', 'Hotels', 'Restaurants', 'Shopping Malls', 'Recreational Parks', 'Hospitals'],
    highlights: ['Oil & Gas Industry', 'Port Operations', 'Economic Hub', 'Growing Entertainment Scene'],
    population: '1.5+ Million',
    avgIncome: 'High',
    avgAge: '30-45 years',
    phases: [],
  },
]
