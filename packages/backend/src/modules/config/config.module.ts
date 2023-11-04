import { Controller, Init } from 'phecda-server'
import * as mongoose from 'mongoose'
import { Logger } from '../logger/logger.service'

@Controller('/config')
export class ConfigModule {
  constructor(protected logger: Logger) {

  }

  @Init
  async init() {
    this.logger.info('start connect')
    if (process.env.TEST) {
      const mongo = await (await import('mongodb-memory-server')).MongoMemoryServer.create()
      process.env.DB_URL = mongo.getUri()
    }
    await mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME })
    this.logger.info('connect db success')
  }
}
