import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
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

  @prop({ default: {} })
  data!: Data
}

export class LinkDTO {
  @prop({ ref: () => AssetDTO, required: true })
  from!: Ref<AssetDTO>

  @prop({ ref: () => AssetDTO, required: true })
  to!: Ref<AssetDTO>

  @prop({ ref: () => NamespaceDTO, required: true })
  namespace!: Ref<NamespaceDTO>
}

export const LinkModel = getModelForClass(LinkDTO)

export class AssetVO<Data = any> {
  @isString()
  name!: string

  @isString()
  type!: string

  @Any
  data!: Data
}

export const AssetModel = getModelForClass(AssetDTO)
