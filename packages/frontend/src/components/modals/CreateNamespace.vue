<script setup lang="ts">
import { useV } from 'phecda-vue'

const { team, refreshNamespace } = $(useV(UserModel))

const data = reactive({
  name: '',
  description: '',
})

const { modelValue } = defineModels<{
  modelValue: boolean
}>()
async function submit(done: any) {
  try {
    await addNamespace(data, team._id)
    refreshNamespace()
    done()
  }
  catch (e) {

  }
}
</script>

<template>
  <a-modal v-model:visible="modelValue" title="创建命名空间" ok-text="添加" @cancel="modelValue = false" @before-ok="submit">
    <a-form :model="data">
      <a-form-item field="name" label="name">
        <a-input v-model="data.name" />
      </a-form-item>
      <a-form-item field="description" label="description">
        <a-input v-model="data.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
