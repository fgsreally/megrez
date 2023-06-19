import type { UserConfig } from 'vite'
import type { MegrezServerPluginOptions } from './plugins/server'
import type { MegrezClientPluginOptions } from './plugins/client'
export type MegrezMode = 'lib' | 'client' | 'server'

export type MegrezOptions = Partial<{
  vite: UserConfig
} & MegrezServerPluginOptions & MegrezClientPluginOptions>
