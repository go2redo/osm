import { computed, type ComputedRef } from 'vue'
import { useMapStore } from '@/store'
import { fetchPlaces } from '@/services'
import type { Place } from '@/types'

export function usePlaces(): { filteredPlaces: ComputedRef<Place[]> } {
  const store = useMapStore()
  const places = fetchPlaces()

  store.setFilters(Array.from(new Set(places.map((place) => place.type))))

  const filteredPlaces = computed(() => {
    const activeFilters = store.activeFilters
    if (!activeFilters.length) return places

    const filterSet = new Set(activeFilters)
    return places.filter((place) => filterSet.has(place.type))
  })

  return { filteredPlaces }
}
