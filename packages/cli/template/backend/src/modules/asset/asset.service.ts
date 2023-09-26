import { BadRequestException } from 'phecda-server'
import type { NamespaceDoc } from '../namespace/namespace.model'
import type { UserDoc } from '../user/user.model'
import { AssetModel } from './asset.model'

export class AssetService<Data> {
  async create({ name, category, data }: { name: string; category: string; data?: Data }, namespace: NamespaceDoc, user: UserDoc) {
    if (await AssetModel.findOne({ name, category, namespace }))
      throw new BadRequestException(`已有类型为${category}的同名资产`)
    return AssetModel.create({ name, category, data, owner: user, creator: user, namespace })
  }
}
