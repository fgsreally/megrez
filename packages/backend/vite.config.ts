import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import { Pub } from 'dubhe-pub/vite'
import DubheConfig from './dubhe.config'
export default defineConfig(({ mode }) => {
  if (mode === 'server') {
    return {
      ssr: {
        format: 'cjs',
      },
      server: {
        port: 3699,
      },
      plugins: [

        VitePluginNode({
          adapter: 'express',
          tsCompiler: 'swc',
          appPath: './src/index.ts',
        }),
      ],
    }
  }
  return {
    plugins: [
      Pub(DubheConfig)
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {

    },
  }
})
