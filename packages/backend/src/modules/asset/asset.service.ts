import { BadRequestException } from 'phecda-server'
import type { NamespaceDoc } from '../namespace/namespace.model'
import type { UserDoc } from '../user/user.model'
import { AssetModel } from './asset.model'

export class AssetService<Data> {
  async create({ name, type, data }: { name: string; type: string; data?: Data }, namespace: NamespaceDoc, user: UserDoc) {
    if (await AssetModel.findOne({ name, type, namespace }))
      throw new BadRequestException(`已有类型为${type}的同名资产`)
    return AssetModel.create({ name, type, data, owner: user, creator: user, namespace })
  }
}
