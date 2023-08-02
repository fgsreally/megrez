<script setup lang="ts">
import { register } from '@/api/user'

const form = reactive({
  username: '',
  email: '',
  password: '',
})

async function registerOrLogin() {
  const token = await register(form.username, form.email, form.password)
  localStorage.setItem('auth', token)
}
</script>

<template>
  <div>
    <a-button>login</a-button>
    <a-form :model="form" @submit="registerOrLogin">
      <a-form-item>
        <a-input v-model="form.username" />
      </a-form-item>
      <a-form-item>
        <a-input v-model="form.email" />
      </a-form-item>
      <a-form-item>
        <a-input v-model="form.password" />
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped></style>
