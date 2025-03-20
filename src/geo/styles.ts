import type { FeatureLike } from 'ol/Feature'
import { Fill, Stroke } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'

const DEFAULT_EMOJI = '🧟'

export function createEmojiStyle(): Style {
  return new Style({
    text: new Text({
      text: DEFAULT_EMOJI,
      font: '24px sans-serif',
    }),
  })
}

export function createClusterStyle(feature: FeatureLike): Style {
  const size = feature.get('features').length
  return new Style({
    image: new CircleStyle({
      radius: Math.min(10 + size * 2, 40),
      fill: new Fill({ color: 'rgba(255, 165, 0, 0.8)' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
    }),
  })
}
