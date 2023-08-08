<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

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
    <a-menu
      :default-open-keys="['1']" :default-selected-keys="['0_3']" :style="{ width: '100%' }"
    >
      <a-menu-item key="0_1" disabled>
        <p>1</p>
        Menu 1
      </a-menu-item>
      <a-menu-item key="0_2">
        <p>2</p>
        Menu 2
      </a-menu-item>
      <a-menu-item key="0_3">
        <p>3</p>
        Menu 3
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped></style>
