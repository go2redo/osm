import { defineStore } from 'pinia'
import { fromLonLat } from 'ol/proj'
import { fetchUsers } from '@/services'
import type { MapState, Place, User } from '@/types'
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
    async fetchUsers() {
      this.users = await fetchUsers()
      indexUsers(this.users)
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
    findNearestUsers(placeCoords: [number, number]) {
      const nearest = findNearestUsers(placeCoords)
      this.nearestUsers = nearest
    },
    addNewPlace(newPlace: Place) {
      if (this.activeFilters.includes(newPlace.type) || this.activeFilters.length === 0) {
        this.addedPlaces.push(newPlace)
      }
    },
  },
  getters: {
    activeFilters: (state) =>
      state.filters.filter((filter) => filter.isActive).map((filter) => filter.type),
  },
})
