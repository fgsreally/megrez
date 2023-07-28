import { Init } from 'phecda-server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import * as mongoose from 'mongoose'

export class ConfigModule {
  @Init
  async init() {
    const mongo = await MongoMemoryServer.create()
    const uri = mongo.getUri()
    await mongoose.connect(uri)
  }
}
