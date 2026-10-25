export type Category = 'Engineering' | 'Medical' | 'Government' | 'Technology' | 'School & Foundation' | 'Design & Law'
export type TeachingMode = 'Offline' | 'Online' | 'Hybrid'
export type ListingStatus = 'Demo listing' | 'Pending review' | 'Verified'

export interface Institute {
  id: string
  name: string
  shortName: string
  tagline: string
  city: string
  state: string
  locality: string
  category: Category
  exams: string[]
  modes: TeachingMode[]
  feeMin: number
  feeMax: number
  rating: number
  reviews: number
  status: ListingStatus
  accent: string
  featured?: boolean
  description: string
}
