<script setup lang="ts">
import { useRequest } from 'vue-request'
import G6 from '@antv/g6'
import { useRoute } from 'vue-router'
import { getAsset } from '@/api/asset'

const route = useRoute()
const { data, run } = useRequest(getAsset, {
  manual: true,
  cacheKey(params) {
    if (params && params[0])
      return `asset-${params[0]}`

    return ''
  },
})

const container = ref<HTMLElement>()

watch(() => route.params.namespace, renderGraph)
async function renderGraph() {
  const graph = new G6.Graph({
    container: container.value, // 指定挂载容器
    width: 800, // 图的宽度
    height: 500, // 图的高度
  })
  await run(route.params.namespace as string)
  graph.data(data.value)
  graph.render()
}
</script>

<template>
  <div ref="container" />
</template>

<style scoped>

</style>
