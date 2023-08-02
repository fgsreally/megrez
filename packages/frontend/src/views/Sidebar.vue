<script setup lang="ts">
const collapsed = ref(false)
</script>

<template>
  <div>
    <a-layout-sider
      hide-trigger collapsible :collapsed="collapsed"
      @collapse="onCollapse"
    >
      <a-menu
        :default-open-keys="['1']" :default-selected-keys="['0_3']" :style="{ width: '100%' }"
      >
        <a-menu-item key="0_1" disabled>
          <IconHome />
          Menu 1
        </a-menu-item>
        <a-menu-item key="0_2">
          <IconCalendar />
          Menu 2
        </a-menu-item>
        <a-menu-item key="0_3">
          <IconCalendar />
          Menu 3
        </a-menu-item>
        <a-sub-menu key="1">
          <template #title>
            <span>
              <IconCalendar />Navigation 1
            </span>
          </template>
          <a-menu-item key="1_1">
            Menu 1
          </a-menu-item>
          <a-menu-item key="1_2">
            Menu 2
          </a-menu-item>
          <a-sub-menu key="2" title="Navigation 2">
            <a-menu-item key="2_1">
              Menu 1
            </a-menu-item>
            <a-menu-item key="2_2">
              Menu 2
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="3" title="Navigation 3">
            <a-menu-item key="3_1">
              Menu 1
            </a-menu-item>
            <a-menu-item key="3_2">
              Menu 2
            </a-menu-item>
            <a-menu-item key="3_3">
              Menu 3
            </a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="4">
          <template #title>
            <span>
              <IconCalendar />Navigation 4
            </span>
          </template>
          <a-menu-item key="4_1">
            Menu 1
          </a-menu-item>
          <a-menu-item key="4_2">
            Menu 2
          </a-menu-item>
          <a-menu-item key="4_3">
            Menu 3
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<style scoped></style>
