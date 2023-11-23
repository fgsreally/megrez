import { getModelForClass } from '@typegoose/typegoose'
import { Init, Tag } from 'phecda-server'
import * as mongoose from 'mongoose'
import { AssetDTO } from '../asset/asset.model'
import { RecordDTO } from '../record/record.model'
import { NamespaceDTO } from '../namespace/namespace.model'
import { Logger } from '../logger/logger.service'
import { TeamDTO } from '../team/team.model'
import { UserDTO } from '../user/user.model'
@Tag('DB')
export class DbModule {
  namespace = getModelForClass(NamespaceDTO)
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
    await mongoose.connect(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    this.logger.info('connect db success')
  }

  record(namespace: string) {
    return getModelForClass(RecordDTO, {
      schemaOptions: {
        collection: `record_${namespace}`,
      },
      options: {
        automaticName: true,
      },
    })
  }

  asset(namespace: string) {
    return getModelForClass(AssetDTO, {
      schemaOptions: {
        collection: `asset_${namespace}`,
      },
      options: {
        automaticName: true,
      },
    })
  }
}
