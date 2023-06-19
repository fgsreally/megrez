<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
function invoke() {
  throw new Error('miss')
}
</script>

<template>
  <main @click="invoke">
    <TheWelcome />
  </main>
</template>
