import autoImport from 'unplugin-auto-import/vite'
import { mergeOptions } from '../../utils'

export default function (opts: Parameters<typeof autoImport>[0]) {
  return autoImport(mergeOptions({
    dirs: ['src/!(server)/**/*', 'src/**/*.controller.ts'],
    dts: './import-client.d.ts',

    imports: ['vue',
      'vue-router',
      {
        '@vueuse/core': [
          'useMouse',
          ['useFetch', 'useMyFetch'],
        ],
        'axios': [
          ['default', 'axios'],
        ],
      },
    ],
  }, opts))
}
