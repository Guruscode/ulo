export interface Neighbourhood {
  id: string
  name: string
  slug: string
  description: string
  fullDescription: string
  coordinates: {
    lat: string
    lng: string
  }
  image: string
  images: string[]
  amenities: string[]
  demographics: {
    population: string
    avgIncome: string
    avgAge: string
  }
  highlights: string[]
  phases?: {
    name: string
    description: string
    image: string
  }[]
}

export const neighbourhoods: Neighbourhood[] = [
  {
    id: '1',
    name: 'Lagos',
    slug: 'lagos',
    description: 'Nigeria\'s largest and most vibrant city',
    fullDescription: 'Lagos is Nigeria\'s largest and most vibrant city, known for its bustling commercial activity, beautiful beaches, and diverse population. It serves as the economic powerhouse of Nigeria with world-class amenities, vibrant nightlife, and numerous investment opportunities. The city offers a perfect blend of modern infrastructure and traditional culture.',
    coordinates: {
      lat: '6° 27\' 4.104" N',
      lng: '3° 23\' 18.24" E',
    },
    image: 'https://www.pexels.com/photo/black-laptop-placed-on-table-271618',
    images: [
      'https://www.pexels.com/photo/black-laptop-placed-on-table-271618',
    ],
    amenities: [
      'Shopping Malls',
      'Fine Dining',
      'Beaches',
      'Golf Courses',
      'Hospitals',
      'Universities',
      'International Schools',
    ],
    demographics: {
      population: '15+ Million',
      avgIncome: 'High',
      avgAge: '28-35 years',
    },
    highlights: [
      'Lekki Peninsula Development',
      'Victoria Island Commercial Hub',
      'Ikoyi Residential District',
      'Island Lifestyle',
    ],
  },
  {
    id: '2',
    name: 'Abuja',
    slug: 'abuja',
    description: 'Nigeria\'s federal capital with modern infrastructure',
    fullDescription: 'Abuja is the capital city of Nigeria, located in the central part of the country. It became the capital in 1991, replacing Lagos, to promote a more centralized location for governance. The city is known for its modern infrastructure, wide streets, and prominent landmarks, such as the Nigerian National Mosque, Nigerian National Christian Centre, and Aso Rock, a massive rock formation that overlooks the city.',
    coordinates: {
      lat: '9° 4\' 35.3244" N',
      lng: '7° 23\' 54.8664" E',
    },
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
    ],
    amenities: [
      'Government Offices',
      'Shopping Centers',
      'Parks',
      'International Hotels',
      'Hospitals',
      'Private Schools',
      'Entertainment Venues',
    ],
    demographics: {
      population: '3+ Million',
      avgIncome: 'Middle to High',
      avgAge: '25-40 years',
    },
    highlights: [
      'Planned City Layout',
      'Aso Rock Monument',
      'Federal Government Area',
      'Growing Real Estate Market',
    ],
    phases: [
      {
        name: 'Phase 1',
        description: 'Initial development area with government structures and commercial establishments',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=300&fit=crop',
      },
      {
        name: 'Phase 2',
        description: 'Expanded residential and commercial zones with modern amenities',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
      },
      {
        name: 'Phase 3',
        description: 'Latest development area with cutting-edge infrastructure and services',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&h=300&fit=crop',
      },
    ],
  },
  {
    id: '3',
    name: 'Port Harcourt',
    slug: 'port-harcourt',
    description: 'Major oil and gas hub on the Niger Delta',
    fullDescription: 'Port Harcourt is the capital of Rivers State and serves as the major hub for Nigeria\'s oil and gas industry. Located on the Niger Delta, it\'s a crucial port city with significant economic importance. The city has experienced rapid growth and development, attracting both local and international businesses.',
    coordinates: {
      lat: '4° 46\' 17.364" N',
      lng: '7° 0\' 51.66" E',
    },
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=300&fit=crop',
    ],
    amenities: [
      'Port Facilities',
      'Oil & Gas Companies',
      'Hotels',
      'Restaurants',
      'Shopping Malls',
      'Recreational Parks',
      'Hospitals',
    ],
    demographics: {
      population: '1.5+ Million',
      avgIncome: 'High',
      avgAge: '30-45 years',
    },
    highlights: [
      'Oil & Gas Industry',
      'Port Operations',
      'Economic Hub',
      'Growing Entertainment Scene',
    ],
  },
  {
    id: '4',
    name: 'Delta',
    slug: 'delta',
    description: 'Coastal region with rich natural resources',
    fullDescription: 'Delta State is located in the Niger Delta region and is known for its vast natural resources, particularly oil and gas. The state features diverse communities, waterways, and tropical vegetation. It\'s an important economic zone with significant investment opportunities in energy, agriculture, and tourism.',
    coordinates: {
      lat: '6° 11\' 9.18" N',
      lng: '6° 43\' 46.95" E',
    },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    ],
    amenities: [
      'Waterfront Properties',
      'Nature Reserves',
      'Fishing Communities',
      'Agricultural Zones',
      'Resorts',
      'Eco-Tourism Sites',
    ],
    demographics: {
      population: '4+ Million',
      avgIncome: 'Middle',
      avgAge: '28-40 years',
    },
    highlights: [
      'Natural Resources',
      'Waterway Access',
      'Agricultural Potential',
      'Tourism Opportunities',
    ],
  },
  {
    id: '5',
    name: 'Ibadan',
    slug: 'ibadan',
    description: 'Cultural capital with historical significance',
    fullDescription: 'Ibadan is the largest city in Nigeria by land area and serves as the capital of Oyo State. Known as the cultural capital, it has deep historical roots dating back several centuries. The city is home to the prestigious University of Ibadan and features a blend of traditional and modern architecture with vibrant cultural activities.',
    coordinates: {
      lat: '7° 20\' 55.392" N',
      lng: '3° 52\' 45.444" E',
    },
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500&h=300&fit=crop',
    ],
    amenities: [
      'Universities',
      'Cultural Centers',
      'Historical Sites',
      'Markets',
      'Museums',
      'Hotels',
      'Entertainment Venues',
    ],
    demographics: {
      population: '3+ Million',
      avgIncome: 'Middle',
      avgAge: '25-40 years',
    },
    highlights: [
      'University of Ibadan',
      'Cultural Heritage',
      'Historical Sites',
      'Traditional Markets',
    ],
  },
]
