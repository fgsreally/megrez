import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
window.addEventListener('error', (e) => {
  console.log(e)
  const { bubbles, cancelable, colno, composed, error, filename, lineno, message } = e
  console.log(JSON.stringify({ bubbles, cancelable, colno, composed, error, filename, lineno, message }))
})
app.use(router)
app.config.errorHandler = (e: any, instance, info) => {
  // handle error, e.g. report to a service
  console.log(e, instance, info)

  const { name, stack, message } = e
  console.log(JSON.stringify({ name, stack, message }))
}
app.mount('#app')
