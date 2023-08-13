<script setup lang="ts">
import { Graph } from '@antv/g6'
import { useV } from 'phecda-vue'
import { useRequest } from 'vue-request'
import { getAsset } from '@/api/asset'

const { namespace } = $(useV(UserModel))

const { runAsync } = useRequest(getAsset, {
  manual: true,
  cacheKey(params) {
    if (params)
      return `asset-${params[0]}`
    return ''
  },
})

const container = ref<HTMLElement>()
let graph: Graph
onBeforeRouteUpdate(async () => {
  await nextTick()
  renderGraph()
})
onMounted(() => {
  graph = new Graph({
    container: container.value!, // 指定挂载容器
    width: 800, // 图的宽度
    height: 500, // 图的高度
  })
  renderGraph()
})
async function renderGraph() {
  const assets = await runAsync(namespace._id)

  graph.data(handleAsset(assets, {}))
  graph.render()
}
</script>

<template>
  <div ref="container" />
</template>

<style scoped>

</style>
