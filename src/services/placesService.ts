import type { Place } from '@/types'

import placesData from '../data/places.json'

export function fetchPlaces(): Place[] {
  try {
    return placesData
  } catch (error) {
    console.error('Failed to fetch places:', error)
    return []
  }
}
