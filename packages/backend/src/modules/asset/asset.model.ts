import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { UserEntity } from '../user/user.model'
import { isString } from '../../decorators/faker'
import { NamespaceEntity } from '../namespace/namespace.model'

class AssetEntity {
  _id!: string

  @isString('资产必须有名字')
  @prop({ required: true })
  name!: string

  @isString('资产必须存在类型')
  @prop({ required: true })
  type!: string

  @prop({ required: true, ref: () => NamespaceEntity, foreignField: 'assets', localField: 'namespace' })
  namespace!: Ref<NamespaceEntity>

  @prop({ required: true, ref: () => UserEntity })
  creator!: Ref<UserEntity>

  @prop({ required: true, ref: () => UserEntity })
  users!: Ref<UserEntity>

  @prop({ required: true, ref: () => AssetEntity })
  dependences!: Ref<AssetEntity>[]

  @prop({ required: true, ref: () => AssetEntity })
  includes!: Ref<AssetEntity>[]

  @prop({ required: true })
  data!: any
}

const AssetModel = getModelForClass(AssetEntity)

export { AssetEntity, AssetModel }
