import autoImport from 'unplugin-auto-import/vite'
import { mergeOptions } from '../../utils'
export default function (opts: Parameters<typeof autoImport>[0]) {
  return autoImport(mergeOptions({
    dirs: ['src/server/**/*', 'src/utils/**/*', 'src/schemas/**/*', 'src/config/**/*'],
    dts: './import-server.d.ts',

    imports: [

      {
        '@nestjs/common': [
        // default imports
          'Controller',
          'Get', 'Post', 'Body',
        ],
      },
    ],
  }, opts))
}
