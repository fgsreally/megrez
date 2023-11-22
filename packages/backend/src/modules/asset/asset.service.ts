import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { NamespaceService } from '../namespace/namespace.service'
import type { UserDTO } from '../user/user.model'
import type { NamespaceDTO } from '../namespace/namespace.model'
import { DbModule } from '../db'
import type { AssetDTO } from './asset.model'

@Tag('asset')
export class AssetService<Data = any> {
  constructor(protected namespaceService: NamespaceService, protected DB: DbModule) {

  }

  async create({ name, type, data }: { name: string; type: string; data?: Data }, namespace: DocumentType<NamespaceDTO>, user: DocumentType<UserDTO>) {
    if (await this.DB.asset.findOne({ name, type, namespace }))
      throw new BadRequestException(`已有类型为${type}的同名资产`)
    return this.DB.asset.create({ name, type, data, owner: user, creator: user, namespace })
  }

  async findOne(asset: string | DocumentType<AssetDTO>, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof asset === 'string') {
      const ret = await this.DB.asset.findById(asset).populate('invokers').populate('dependences')
      if (!ret)
        throw new BadRequestException(`不存在id为${asset}的record`)
      asset = ret
    }

    asset.namespace = await this.namespaceService.findOne(asset.namespace, user, auth)

    return asset
  }

  async createLink(from: DocumentType<AssetDTO>, to: DocumentType<AssetDTO>) {
    await this.DB.link.create({ from, to, namespace: from.namespace })
  }

  async deleteLink(id: string) {
    await this.DB.link.deleteOne({ _id: new Types.ObjectId(id) })
  }
}
