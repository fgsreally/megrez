<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const router = useRouter()
async function registerOrLogin() {
  try {
    const token = await login(form.username, form.email, form.password)
    localStorage.setItem('auth', token)

    router.push('/main')
  }
  catch (e) {
    Message.error({
      content: e.message,
    })
  }
}
</script>

<template>
  <div>
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
      <a-form-item>
        <a-button @click="registerOrLogin">
          login
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped></style>
