import { NotFoundException, Tag } from 'phecda-server'
import type { NamespaceEntity } from '../namespace/namespace.model'
import type { UserEntity } from '../user/user.model'
import type { AssetEntity } from './asset.model'
import { AssetModel } from './asset.model'

@Tag('asset')
export class AssetService {
  create(user: UserEntity, asset: AssetEntity) {
    return AssetModel.create({
      creator: user,
      owner: user,
      users:[user],
      ...asset as any,
    })
  }

  findByNamespace(namespace: NamespaceEntity | string) { // get all assets
    return AssetModel.find({ namespace })
  }

  async delete(id: string) {
    return AssetModel.findByIdAndRemove(id)
  }

  async createLink(dependenceId: string, invokerId: string) {
    const dependence = await AssetModel.findById(dependenceId)
    if (!dependence)
      throw new NotFoundException(`没找到id为${dependenceId}的资产作为依赖`)
    const invoker = await AssetModel.findById(invokerId)
    if (!invoker)
      throw new NotFoundException(`没找到id为${invokerId}的资产调用方`)
    invoker.dependences.push(dependence)
    dependence.invokers.push(invoker)
    await invoker.save()
    await dependence.save()
    return true
  }
}
