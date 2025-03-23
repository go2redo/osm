import { defineStore } from 'pinia'
import { fromLonLat } from 'ol/proj'
import { fetchUsers } from '@/services'
import type { MapState, Place } from '@/types'
import { findNearestUsers, indexUsers } from '@/geo/userSearch'

export const useMapStore = defineStore('map', {
  state: (): MapState => ({
    currentCenter: fromLonLat([35.0462, 48.4647]),
    zoomLevel: 4,
    filters: [],
    selectedPlace: null,
    users: [],
    nearestUsers: [],
    addedPlaces: [],
  }),
  actions: {
    async fetchUsers(): Promise<void> {
      this.users = await fetchUsers()
      indexUsers(this.users)
    },
    setFilters(types: string[]): void {
      this.filters = types.map((type) => ({ type, isActive: false }))
    },
    toggleFilter(type: string): void {
      const filter = this.filters.find((filter) => filter.type === type)
      if (filter) filter.isActive = !filter.isActive
    },
    resetFilters(): void {
      this.filters.forEach((filter) => (filter.isActive = false))
    },
    setSelectedPlace(place: Place | null): void {
      this.selectedPlace = place
    },
    findNearestUsers(placeCoords: [number, number]) {
      this.nearestUsers = findNearestUsers(placeCoords)
    },
    resetNearestUsers(): void {
      this.nearestUsers = []
    },
    addNewPlace(newPlace: Place): void {
      if (this.activeFilters.includes(newPlace.type) || this.activeFilters.length === 0) {
        this.addedPlaces.push(newPlace)
        this.setSelectedPlace(newPlace)
      }
    },
  },
  getters: {
    activeFilters: (state) =>
      state.filters.filter((filter) => filter.isActive).map((filter) => filter.type),
  },
})
