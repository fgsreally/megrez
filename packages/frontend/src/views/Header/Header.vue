<script setup lang="ts">
import { useRequest } from 'vue-request'
import UserInfo from './UserInfo.vue'
import { useModalLayer } from '@/composables/modal'
const { data } = useRequest(getUserInfo, {
  cacheKey: 'user-info',
})
const userOptions = [

  {
    label: 'profile',
    action: () => useModalLayer(UserInfo),
  },
]
</script>

<template>
  <div>
    <a-layout-header>
      <a-dropdown trigger="hover">
        <a-avatar>
          <!-- <img  :src="data"> -->
        </a-avatar>
        <template #content>
          <a-doption v-for="(item, i) in userOptions" :key="i" @click="item.action">
            {{ item.label }}
          </a-doption>
          <a-doption disabled>
            Option 2
          </a-doption>
        </template>
      </a-dropdown>
    </a-layout-header>
  </div>
</template>

<style scoped>

</style>
