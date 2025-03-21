import { defineStore } from 'pinia'
import { fromLonLat } from 'ol/proj'
import { fetchUsers } from '@/services'
import type { MapState, Place, User } from '@/types'

export const useMapStore = defineStore('map', {
  state: (): MapState => ({
    currentCenter: fromLonLat([35.0462, 48.4647]),
    zoomLevel: 14,
    filters: [],
    selectedPlace: null,
    users: [],
    nearestUsers: [],
    highlightedUsers: [],
  }),
  actions: {
    async fetchUsers() {
      this.users = await fetchUsers()
    },
    setFilters(types: string[]) {
      this.filters = types.map((type) => ({ type, isActive: false }))
    },
    toggleFilter(type: string) {
      const filter = this.filters.find((filter) => filter.type === type)
      if (filter) filter.isActive = !filter.isActive
    },
    resetFilters() {
      this.filters.forEach((filter) => (filter.isActive = false))
    },
    setSelectedPlace(place: Place | null) {
      this.selectedPlace = place
    },
    setNearestUsers(users: User[]) {
      this.nearestUsers = users
    },
  },
  getters: {
    activeFilters: (state) =>
      state.filters.filter((filter) => filter.isActive).map((filter) => filter.type),
  },
})
