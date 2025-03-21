import RBush from 'rbush'
import { point } from '@turf/helpers'
import distance from '@turf/distance'
import type { IndexedUser, User } from '@/types'

const userIndex = new RBush<IndexedUser>()

export function indexUsers(users: User[]): void {
  userIndex.clear()
  userIndex.load(
    users
      .map((user) => {
        const longitude = parseFloat(user.address.geo.lng)
        const latitude = parseFloat(user.address.geo.lat)

        return {
          ...user,
          coordinates: [longitude, latitude],
          minX: longitude,
          minY: latitude,
          maxX: longitude,
          maxY: latitude,
        }
      })
      .filter(Boolean) as IndexedUser[],
  )
}

export function findNearestUsers(
  placeCoords: [number, number],
  count = 3,
): { user: IndexedUser; distance: number }[] {
  return userIndex
    .search({
      minX: -180,
      minY: -90,
      maxX: 180,
      maxY: 90,
    })
    .map((user) => ({
      user,
      distance: distance(point(placeCoords), point(user.coordinates), { units: 'kilometers' }),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
}
