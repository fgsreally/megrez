import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { FilterQuery } from 'mongoose'
import type { NamespaceDTO } from '../namespace/namespace.model'
import type { UserDTO } from '../user/user.model'
import { NamespaceService } from '../namespace/namespace.service'
import { DbModule } from '../db'
import type { RecordDTO } from './record.model'
@Tag('record')
export class RecordService {
  constructor(protected DB: DbModule, protected namespaceService: NamespaceService) {

  }

  getByNamespace(namespace: NamespaceDTO, skip: number, limit: number) {
    return this.DB.record.find({ namespace }).limit(limit).skip(skip)
  }

  queryByNamespace(namespace: NamespaceDTO, query: FilterQuery<RecordDTO>, skip: number, limit: number) {
    return this.DB.record.find(Object.assign(query, { namespace })).limit(limit).skip(skip)
  }

  async findOne(record: string | DocumentType<RecordDTO>, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof record === 'string') {
      const ret = await this.DB.record.findById(record)
      if (!ret)
        throw new BadRequestException(`不存在id为${record}的record`)
      record = ret
    }

    record.namespace = await this.namespaceService.findOne(record.namespace.toString(), user, auth)

    return record
  }
}
