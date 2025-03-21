import { computed } from 'vue'
import { useMapStore } from '@/store'
import { fetchPlaces } from '@/services'

export function usePlaces() {
  const store = useMapStore()
  const places = fetchPlaces()

  store.setFilters(Array.from(new Set(places.map((place) => place.type))))

  const filteredPlaces = computed(() => {
    const activeFilters = store.activeFilters
    if (!activeFilters.length) return places

    const filterSet = new Set(activeFilters)
    return places.filter((place) => filterSet.has(place.type))
  })

  const filteredAddedPlaces = computed(() => {
    const activeFilters = store.activeFilters
    if (!activeFilters.length) return store.addedPlaces

    const filterSet = new Set(activeFilters)
    return store.addedPlaces.filter((place) => filterSet.has(place.type))
  })

  return { filteredPlaces, filteredAddedPlaces }
}
