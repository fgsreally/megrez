import vue from '@vitejs/plugin-vue'
import { mergeOptions } from '../../utils'

export default function (opts: Parameters<typeof vue>[0]) {
  return vue(mergeOptions({ reactivityTransform: true }, opts))
}
