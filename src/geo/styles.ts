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
