import { Feature } from 'ol'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import type { User } from '@/types'
import { createEmojiStyle } from './styles'

export const createUserFeatures = (users: User[]): VectorSource => {
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
