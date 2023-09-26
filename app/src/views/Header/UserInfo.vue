<script setup lang="ts">
import { useRequest } from 'vue-request'
const { data } = useRequest(getUserInfo, {
  cacheKey: 'user-info',
})
</script>

<template>
  <div>
    <a-descriptions :data="data" title="User Info" layout="inline-horizontal" />
  </div>
</template>

<style scoped>

</style>
