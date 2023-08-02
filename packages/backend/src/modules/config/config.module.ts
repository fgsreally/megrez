import { Controller, Init } from 'phecda-server'
import * as mongoose from 'mongoose'

@Controller('/config')
export class ConfigModule {
  @Init
  async init() {
    console.log('start connect')
    await mongoose.connect(import.meta.env.VITE_DB_URL, { dbName: 'megrez' })
    console.log('connect db success')
  }
}
