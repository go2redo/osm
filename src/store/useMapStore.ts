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
    setSelectedPlace(place: Place | null) {
      this.selectedPlace = place
    },
    setNearestUsers(users: User[]) {
      this.nearestUsers = users
    },
  },
})
