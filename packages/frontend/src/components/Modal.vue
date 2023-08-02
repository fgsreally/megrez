<script setup lang="ts">
const { modelValue } = defineModels<{
  modelValue: boolean
}>()
</script>

<template>
  <Teleport v-if="modelValue" to="body" tag="section">
    <div>
      <slot />
    </div>
  </Teleport>
</template>

<style scoped></style>
