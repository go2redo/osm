import { Feature } from 'ol'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import type { Place, User } from '@/types'
import { createEmojiStyle } from './styles'
import { Cluster } from 'ol/source'

export function createUserFeatures(users: User[]): VectorSource {
  const emojiStyle = createEmojiStyle()

  const features = users.map((user) => {
    const coords = [Number(user.address.geo.lng), Number(user.address.geo.lat)]
    const feature = new Feature({
      geometry: new Point(fromLonLat(coords)),
      name: user.name,
      coordinates: coords,
    })
    feature.setStyle(emojiStyle)
    return feature
  })

  const vectorSource = new VectorSource()
  vectorSource.addFeatures(features)
  return vectorSource
}

export function createClusteredPlaceFeatures(
  places: Place[],
  clusterDistance: number = 50,
  zoomLevel: number = 5,
): Cluster {
  const features = places.map(({ id, name, type, coordinates }) => {
    const correctedCoordinates = [coordinates[1], coordinates[0]]
    const feature = new Feature({
      id,
      geometry: new Point(fromLonLat(correctedCoordinates)),
      name,
      type,
      coordinates: correctedCoordinates,
    })
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
