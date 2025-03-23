import { fetchPlaces } from '@/services'
import type { Place } from '@/types'

// Initialize the filter list with unique place types
export function initFilters(): string[] {
  return Array.from(new Set(fetchPlaces().map((place) => place.type)))
}

// Filter places by type
export function filterPlaces(places: Place[], activeFilters: string[]): Place[] {
  if (!activeFilters.length) return places

  const filterSet = new Set(activeFilters)
  return places.filter((place) => filterSet.has(place.type))
}
