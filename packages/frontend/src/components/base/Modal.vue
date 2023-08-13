<script setup lang="ts">
import { emitter } from 'phecda-vue';
const { modelValue } = defineModels<{
  modelValue: boolean
}>()

emitter.on('cancel')
</script>

<template>
  <a-modal v-model:visible="modelValue" @cancel="modelValue = false">
    <slot ref="el" />
  </a-modal>
</template>

<style scoped></style>
