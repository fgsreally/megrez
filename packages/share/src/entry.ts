import { fileURLToPath } from 'url'
import type { UserConfig } from 'vite'
import { createClientPlugins } from './plugins/client'
import { createServerPlugins } from './plugins/server'
import type { MegrezMode, MegrezOptions } from './types'
import { mergeOptions } from './utils'

export function defineConfig(options: MegrezOptions = {}): Record<MegrezMode, UserConfig > {
  const viteConfig = mergeOptions({
    optimizeDeps: {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '~': fileURLToPath(new URL('./src/server', import.meta.url)),
        },
      },

      exclude: [

      ],
    },
  }, options.vite)
  return {
    client: mergeOptions({
      plugins: createClientPlugins(options),
    }, viteConfig),
    lib: {},
    server: mergeOptions({
      plugins: createServerPlugins(options),
    }, viteConfig),
  }
}
