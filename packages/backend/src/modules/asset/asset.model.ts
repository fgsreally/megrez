import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Any, isString } from '../../decorators/faker'
import { NamespaceDTO } from '../namespace/namespace.model'
import { BaseModel } from '../base/base.module'

export class AssetDTO<Data = any> extends BaseModel {
  _id!: string

  @prop({ required: true })
  name!: string

  @prop({ required: true })
  type!: string

  @prop({ required: true, ref: () => NamespaceDTO })
  namespace!: Ref<NamespaceDTO>

  @prop({ ref: () => AssetDTO, default: [] })
  dependences!: Ref<AssetDTO>[]

  @prop({ ref: () => AssetDTO, default: [] })
  invokers!: Ref<AssetDTO>[]

  @prop({ default: {} })
  data!: Data
}

export class AssetVO<Data = any> {
  @isString()
  name!: string

  @isString()
  type!: string

  @Any
  data!: Data
}

export const AssetModel = getModelForClass(AssetDTO)
