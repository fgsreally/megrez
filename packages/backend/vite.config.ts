import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    ssr: {
      format: 'es',
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
})
