import { getModelForClass } from '@typegoose/typegoose'
import { Init, Tag } from 'phecda-server'
import * as mongoose from 'mongoose'
import { AssetDTO, LinkDTO } from '../asset/asset.model'
import { RecordDTO } from '../record/record.model'
import { NamespaceDTO } from '../namespace/namespace.model'
import { Logger } from '../logger/logger.service'
import { TeamDTO } from '../team/team.model'
import { UserDTO } from '../user/user.model'
@Tag('DB')
export class DbModule {
  namespace = getModelForClass(NamespaceDTO)
  asset = getModelForClass(AssetDTO)
  link = getModelForClass(LinkDTO)
  record = getModelForClass(RecordDTO)
  team = getModelForClass(TeamDTO)
  user = getModelForClass(UserDTO)
  constructor(protected logger: Logger) {}
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
