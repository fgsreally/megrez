import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { createReq } from 'phecda-client'

const instance = axios.create({ baseURL: import.meta.env.VITE_BASE_URL })

instance.interceptors.request.use((config) => {
  const token = ''
  if (token)
    config.headers.Authorization = token
  return config
}, (error) => {
  // 请求错误消息提示
  Message.error({
    content: error.message,
    position: 'bottom',
  })
  return Promise.reject(error.data.error.message)
},

)

export const $request = createReq(instance)
