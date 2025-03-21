import type { User } from './User'

export type IndexedUser = User & {
  coordinates: [number, number]
  minX: number
  minY: number
  maxX: number
  maxY: number
}
