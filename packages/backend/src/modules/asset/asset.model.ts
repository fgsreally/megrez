import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { isString } from '../../decorators/faker'
import { NamespaceEntity } from '../namespace/namespace.model'
import { BaseModel } from '../base/base.module'

class AssetEntity extends BaseModel {
  _id!: string

  @isString('必须有名字')
  @prop({ required: true })
  name!: string

  @isString('必须存在类型')
  @prop({ required: true })
  category!: string

  @prop({ required: true, ref: () => NamespaceEntity })
  namespace!: Ref<NamespaceEntity>

  @prop({ default: '' })
  description!: string

  @prop({ required: true, ref: () => AssetEntity, default: [] })
  dependences!: Ref<AssetEntity>[]

  @prop({ required: true, ref: () => AssetEntity, default: [] })
  invokers!: Ref<AssetEntity>[]

  @prop({ })
  data!: any

  @prop({})
  documents!: {
    content: string
    meta: any
  }[]
}

const AssetModel = getModelForClass(AssetEntity)

export { AssetEntity, AssetModel }
