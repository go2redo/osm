import { Easing, Tween, Group as TweenGroup } from '@tweenjs/tween.js'
import type { FeatureLike } from 'ol/Feature'
import Feature from 'ol/Feature'
import { Fill, Stroke } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import Style from 'ol/style/Style'
import Text from 'ol/style/Text'

const ANIMATION_STEPS = 10
const BASE_FONT_SIZE = 24
const MAX_FONT_SIZE = 36
const COLORS = {
  base: 'transparent',
  hover: 'rgba(16, 185, 129, .6)',
  cluster: 'rgba(59, 130, 246, .6)',
  text: '#ffffff',
  stroke: '#ffffff',
}

const styleCache = new Map<string, Style>()

const animationGroup = new TweenGroup()

export function animateFeature(feature: FeatureLike, isHighlighted: boolean): void {
  if (!(feature instanceof Feature)) return

  const from = { step: isHighlighted ? 0 : 10 }
  const to = { step: isHighlighted ? 10 : 0 }
  const duration = 300

  new Tween(from, animationGroup)
    .to(to, duration)
    .easing(Easing.Quadratic.InOut)
    .onUpdate(() => {
      feature.setStyle(createEmojiStyle(isHighlighted, from.step))
    })
    .start()

  function animate() {
    requestAnimationFrame(animate)
    animationGroup.update()
  }

  animate()
}

export function createEmojiStyle(
  isHighlighted: boolean = false,
  step: number = ANIMATION_STEPS,
): Style {
  if (!isHighlighted) {
    return new Style({
      text: new Text({
        text: '👽',
        font: `${BASE_FONT_SIZE}px sans-serif`,
        fill: new Fill({ color: 'rgba(0, 0, 0, 0.5)' }),
      }),
    })
  }

  const currentFontSize =
    BASE_FONT_SIZE + (MAX_FONT_SIZE - BASE_FONT_SIZE) * (step / ANIMATION_STEPS)

  return new Style({
    text: new Text({
      text: '👽',
      font: `${currentFontSize}px sans-serif`,
      fill: new Fill({ color: 'rgba(0, 0, 0, 1)' }),
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
