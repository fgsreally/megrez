<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useV } from 'phecda-vue'
import CreateNamespace from '@/components/modals/CreateNamespace.vue'
const { updateNamespace, namespaces } = $(useV(UserModel))
const visible = ref(false)
const collapsed = ref(false)
const onCollapse = (val: boolean, type: string) => {
  const content = type === 'responsive' ? '触发响应式收缩' : '点击触发收缩'
  Message.info({
    content,
    duration: 2000,
  })
  collapsed.value = val
}
</script>

<template>
  <a-layout-sider
    hide-trigger collapsible :collapsed="collapsed"
    @collapse="onCollapse"
  >
    <div flex justify-between items-center m-4>
      命名空间
      <div>
        <i class="i-lucide:plus block hover:color-blue cursor-pointer" @click="visible = true" />
        <CreateNamespace v-model="visible" />
      </div>
    </div>
    <a-menu
      :style="{ width: '100%' }"
    >
      <a-menu-item v-for="item in namespaces" :key="item.name" @click="updateNamespace(item)">
        <p>{{ item.name }}</p>
        {{ item.description }}
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped></style>
