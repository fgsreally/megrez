import type { PluginOption } from 'vite'
import type { MegrezOptions } from '../../types'
import autoImport from './autoImport'
import componentImport from './componentImport'
import unocss from './unocss'
import vue from './vue'

export interface MegrezClientPluginOptions {
  autoImport: Parameters<typeof autoImport>[0]
  componentImport: Parameters<typeof componentImport>[0]
  unocss: Parameters<typeof unocss>[0]
  vue: Parameters<typeof vue>[0]
}

export function createClientPlugins(options: MegrezOptions): PluginOption {
  return [autoImport(options.autoImport), componentImport(options.componentImport), unocss(options.unocss), vue(options.vue)]
}
