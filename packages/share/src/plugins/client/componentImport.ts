import Components from 'unplugin-vue-components/vite'
import { mergeOptions } from '../../utils'

export default function (opts: Parameters<typeof Components>[0]) {
  return Components(mergeOptions({}, opts))
}
