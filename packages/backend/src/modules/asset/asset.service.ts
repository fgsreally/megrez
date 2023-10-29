import { BadRequestException } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { NamespaceDoc } from '../namespace/namespace.model'
import type { UserDoc } from '../user/user.model'
import type { NamespaceService } from '../namespace/namespace.service'
import type { AssetDTO } from './asset.model'
import { AssetModel } from './asset.model'
export class AssetService<Data> {
  constructor(private namespaceService: NamespaceService) {

  }

  async create({ name, type, data }: { name: string; type: string; data?: Data }, namespace: NamespaceDoc, user: UserDoc) {
    if (await AssetModel.findOne({ name, type, namespace }))
      throw new BadRequestException(`已有类型为${type}的同名资产`)
    return AssetModel.create({ name, type, data, owner: user, creator: user, namespace })
  }

  async findOne(asset: string | DocumentType<AssetDTO>, user: UserDoc, auth: 'user' | 'owner' = 'user') {
    if (typeof asset === 'string') {
      const ret = await AssetModel.findById(asset)
      if (!ret)
        throw new BadRequestException(`不存在id为${asset}的record`)
      asset = ret
    }

    asset.namespace = await this.namespaceService.findOne(asset.namespace, user, auth)

    return asset
  }
}
