import type { Coordinate } from 'ol/coordinate'
import type { User } from './User'

export interface MapState {
  currentCenter: Coordinate
  zoomLevel: number
  filters: string[]
  selectedPlace: string | null
  users: User[]
  nearestUsers: User[]
  highlightedUsers: User[]
}
