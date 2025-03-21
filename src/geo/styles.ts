import type { FeatureLike } from 'ol/Feature'
import { Fill, Stroke } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'

const COLORS = {
  base: 'transparent',
  hover: 'rgba(16, 185, 129, .6)',
  cluster: 'rgba(59, 130, 246, .6)',
  text: '#ffffff',
  stroke: '#ffffff',
}

const styleCache = new Map<string, Style>()

export function createEmojiStyle(): Style {
  return new Style({
    text: new Text({
      text: '🧟',
      font: '24px sans-serif',
    }),
  })
}

export function createClusterStyle(feature: FeatureLike): Style {
  const isHovered = feature.get('isHovered') === true
  const features = feature.get('features') as FeatureLike[] | undefined
  const size = features ? features.length : 1
  const isCluster = size > 1

  if (!isCluster) {
    const styleKey = `emoji-${isHovered}`
    if (styleCache.has(styleKey)) return styleCache.get(styleKey)!

    const style = new Style({
      text: new Text({
        text: '📍',
        font: '20px sans-serif',
        fill: new Fill({ color: isHovered ? COLORS.hover : COLORS.text }),
      }),
    })

    styleCache.set(styleKey, style)
    return style
  }

  const baseColor = COLORS.cluster
  const color = isHovered ? COLORS.hover : baseColor
  const radius = Math.min(10 + Math.log(size + 1) * 3, 30)

  const styleKey = `${color}-${radius}-${size}`
  if (styleCache.has(styleKey)) return styleCache.get(styleKey)!

  const style = new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: COLORS.stroke, width: 2 }),
    }),
    text: new Text({
      text: size.toString(),
      font: '10px sans-serif',
      fill: new Fill({ color: COLORS.text }),
    }),
  })

  styleCache.set(styleKey, style)
  return style
}
