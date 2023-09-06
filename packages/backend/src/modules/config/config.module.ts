import { Controller, Init } from 'phecda-server'
import * as mongoose from 'mongoose'
import { logger } from '../../utils/logger'

@Controller('/config')
export class ConfigModule {
  @Init
  async init() {
    logger.log('start connect')
    await mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME })
    logger.log('connect db success')
  }
}
