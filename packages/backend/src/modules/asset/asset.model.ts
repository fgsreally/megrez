import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Any, isString } from '../../decorators/faker'
import { NamespaceDTO } from '../namespace/namespace.model'
import { BaseModel } from '../base/base.module'

export class AssetDTO<Data = any> extends BaseModel {
  _id!: string

  @prop({ required: true })
  name!: string

  @prop({ required: true })
  category!: string

  @prop({ required: true, ref: () => NamespaceDTO })
  namespace!: Ref<NamespaceDTO>

  @prop({ required: true, ref: () => AssetDTO, default: [] })
  dependences!: Ref<AssetDTO>[]

  @prop({ required: true, ref: () => AssetDTO, default: [] })
  invokers!: Ref<AssetDTO>[]

  @prop({ default: {} })
  data!: Data
}

export class AssetVO<Data = any> {
  @isString()
  name!: string

  @isString()
  category!: string

  @Any
  data!: Data
}

export const AssetModel = getModelForClass(AssetDTO)
