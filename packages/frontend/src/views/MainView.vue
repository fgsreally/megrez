<script setup lang="ts">
import { useV } from 'phecda-vue'
const { namespace } = useV(UserModel)
</script>

<template>
  <main>
    <side-bar />
    <asset-canvas v-if="namespace" />
    <a-empty v-else />
  </main>
</template>
