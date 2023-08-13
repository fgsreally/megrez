import type { EdgeConfig, NodeConfig } from '@antv/g6'
import type { AssetEntity } from '../../../backend/src/modules/asset/asset.model'

export function handleAsset(assets: AssetEntity[], config: Record<string, any>) {
  const nodes: NodeConfig[] = []
  const edges: EdgeConfig[] = []
  for (const asset of assets) {
    const node = {} as unknown as NodeConfig
    node.id = asset._id
    node.metadata = asset
    Object.assign(node, config[asset.category] || {})
    nodes.push(node)
    for (const dep of asset.dependences) {
      edges.push({
        source: asset._id,
        target: (dep as AssetEntity)._id,
      })
    }
    for (const invoker of asset.invokers) {
      edges.push({
        target: asset._id,
        source: (invoker as AssetEntity)._id,
      })
    }
  }

  return { nodes, edges }
}
