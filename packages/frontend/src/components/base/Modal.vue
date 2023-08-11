<script setup lang="ts">
const { modelValue } = defineModels<{
  modelValue: boolean
}>()
</script>

<template>
  <a-modal v-model:visible="modelValue" @cancel="modelValue = false">
    <slot ref="el" />
  </a-modal>
</template>

<style scoped></style>
