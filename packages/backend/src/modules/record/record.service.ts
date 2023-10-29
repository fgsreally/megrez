import { BadRequestException } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { NamespaceDTO } from '../namespace/namespace.model'
import type { UserDoc } from '../user/user.model'
import type { NamespaceService } from '../namespace/namespace.service'
import type { RecordDto } from './record.model'
import { RecordModel } from './record.model'
export class RecordService {
  model = RecordModel
  constructor(private namespaceService: NamespaceService) {

  }

  getByNamespace(namespace: NamespaceDTO, skip: number, limit: number) {
    return RecordModel.find({ namespace }).limit(limit).skip(skip)
  }

  async findOne(record: string | DocumentType<RecordDto>, user: UserDoc, auth: 'user' | 'owner' = 'user') {
    if (typeof record === 'string') {
      const ret = await RecordModel.findById(record)
      if (!ret)
        throw new BadRequestException(`不存在id为${record}的record`)
      record = ret
    }

    record.namespace = await this.namespaceService.findOne(record.namespace, user, auth)

    return record
  }
}