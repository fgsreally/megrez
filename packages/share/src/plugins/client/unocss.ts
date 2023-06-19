import UnoCSS from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import { mergeOptions } from '../../utils'

export default function (opts: Parameters<typeof UnoCSS>[0]) {
  return UnoCSS(mergeOptions({
    presets: [
      presetAttributify({ /* preset options */}),
      presetUno(),
      presetIcons(),
    ],
  }, opts))
}
