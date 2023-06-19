/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SECRET: string
    readonly VITE_DB_URL:string
    // 更多环境变量...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  