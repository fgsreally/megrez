import { Controller, Init } from 'phecda-server'
import * as mongoose from 'mongoose'
import { logger } from '../../utils/logger'

@Controller('/config')
export class ConfigModule {
  @Init
  async init() {
    logger.log('start connect')
    if (process.env.TEST) {
      const mongo = await (await import('mongodb-memory-server')).MongoMemoryServer.create()
      process.env.DB_URL = mongo.getUri()
    }
    await mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME })
    logger.log('connect db success')
  }
}
