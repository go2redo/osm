import { Feature } from 'ol'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import type { Place, User } from '@/types'
import { animateFeature, createEmojiStyle } from './styles'
import { Cluster } from 'ol/source'

export function createUserFeatures(users: User[]): VectorSource {
  const features = users.map((user) => {
    const coords = [Number(user.address.geo.lng), Number(user.address.geo.lat)]
    const feature = new Feature({
      id: user.id,
      geometry: new Point(fromLonLat(coords)),
      name: user.name,
      coordinates: coords,
    })

    feature.setId(user.id)
    feature.set('isHighlighted', false)
    feature.setStyle(createEmojiStyle('👽', false))
    return feature
  })

  return new VectorSource({ features })
}

export function highlightNearestUsers(
  userSource: VectorSource,
  nearestUsers: { user: { id: number }; distance: number }[],
): VectorSource {
  const userFeatures = userSource
    .getFeatures()
    .filter((feature): feature is Feature => feature instanceof Feature)

  userFeatures.forEach((feature) => {
    const isNearest = nearestUsers.some((entry) => entry.user.id === feature.getId())
    animateFeature('👽', feature, isNearest)
  })

  return userSource
}

export function createClusteredPlaceFeatures(
  places: Place[],
  clusterDistance: number = 50,
  zoomLevel: number = 5,
): Cluster {
  const features = places.map(({ id, name, type, coordinates }) => {
    const correctedCoordinates = [coordinates[1], coordinates[0]]
    const feature = new Feature({
      geometry: new Point(fromLonLat(correctedCoordinates)),
      name,
      type,
      coordinates: correctedCoordinates,
    })

    feature.setId(id)

    return feature
  })

  const adjustedDistance = Math.max(clusterDistance / zoomLevel, 10)

  const vectorSource = new VectorSource({
    features,
  })

  return new Cluster({
    distance: adjustedDistance,
    source: vectorSource,
  })
}
