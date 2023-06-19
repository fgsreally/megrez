import type { PluginOption } from 'vite'
import type { MegrezOptions } from './../../types'
import autoImport from './autoImport'
import VitePluginNode from './node'
export interface MegrezServerPluginOptions {
  autoImport: Parameters<typeof autoImport>[0]
  node: Parameters<typeof VitePluginNode>[0]
}

export function createServerPlugins(options: MegrezOptions): PluginOption {
  return [autoImport(options.autoImport), VitePluginNode(options.node)]
}
