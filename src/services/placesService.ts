import type { Place } from '@/types'

// can be a 100k+ item array someday
// consider using geoJSON
import placesData from '../data/places.json'

export function fetchPlaces(): Place[] {
  try {
    return placesData
  } catch (error) {
    console.error('Failed to fetch places:', error)
    return []
  }
}
