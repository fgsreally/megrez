import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import type { NamespaceDoc } from '../namespace/namespace.model'
import { NamespaceService } from '../namespace/namespace.service'
import type { UserDTO } from '../user/user.model'
import type { AssetDTO } from './asset.model'
import { AssetModel, LinkModel } from './asset.model'

@Tag('asset')
export class AssetService<Data = any> {
  Model = AssetModel
  constructor(private namespaceService: NamespaceService) {

  }

  async create({ name, type, data }: { name: string; type: string; data?: Data }, namespace: NamespaceDoc, user: DocumentType<UserDTO>) {
    if (await AssetModel.findOne({ name, type, namespace }))
      throw new BadRequestException(`已有类型为${type}的同名资产`)
    return AssetModel.create({ name, type, data, owner: user, creator: user, namespace })
  }

  async findOne(asset: string | DocumentType<AssetDTO>, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof asset === 'string') {
      const ret = await AssetModel.findById(asset).populate('invokers').populate('dependences')
      if (!ret)
        throw new BadRequestException(`不存在id为${asset}的record`)
      asset = ret
    }

    asset.namespace = await this.namespaceService.findOne(asset.namespace, user, auth)

    return asset
  }

  async createLink(from: DocumentType<AssetDTO>, to: DocumentType<AssetDTO>) {
    await LinkModel.create({ from, to, namespace: from.namespace })
  }

  async deleteLink(id: string) {
    await LinkModel.deleteOne({ _id: new Types.ObjectId(id) })
  }
}
