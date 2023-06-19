import { VitePluginNode } from 'vite-plugin-node'
import { mergeOptions } from '../../utils'

export default function (opts?: Parameters<typeof VitePluginNode>[0]) {
  return VitePluginNode(mergeOptions({
    adapter: 'nest',
    appPath: './src/server/main.ts',
    tsCompiler: 'swc',
  }, opts))
}
