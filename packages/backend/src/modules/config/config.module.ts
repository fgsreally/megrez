import { Body, Controller, Get, Init, NotFoundException, Param, Post } from 'phecda-server'
import * as mongoose from 'mongoose'

@Controller('/config')
export class ConfigController {
  @Init
  async init() {
    console.log('start connect')
    await mongoose.connect(import.meta.env.VITE_DB_URL, { dbName: 'megrez' })
    console.log('connect db success')
  }
}
