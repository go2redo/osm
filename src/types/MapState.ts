import type { Coordinate } from 'ol/coordinate'
import type { User } from './User'
import type { Place } from './Place'

export interface MapState {
  currentCenter: Coordinate
  zoomLevel: number
  filters: string[]
  selectedPlace: Place | null
  users: User[]
  nearestUsers: User[]
  highlightedUsers: User[]
}
