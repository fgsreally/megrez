import { type Ref, prop } from '@typegoose/typegoose'
import { Any, isString } from '../../decorators/faker'
import { NamespaceDTO } from '../namespace/namespace.model'
import { BaseModel } from '../base/base.module'

export class AssetDTO<Data = any> extends BaseModel {
  @prop({ required: true })
  name!: string

  @prop({ required: true })
  type!: string

  @prop({ required: true, ref: () => NamespaceDTO })
  namespace!: Ref<NamespaceDTO>

  @prop({ default: [], ref: () => AssetDTO })
  dependences!: Ref<AssetDTO>[]

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
