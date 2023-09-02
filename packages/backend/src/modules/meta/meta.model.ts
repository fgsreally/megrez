import type { Ref } from '@typegoose/typegoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { BaseModel } from '../base/base.module'
import { NamespaceEntity } from '../namespace/namespace.model'

class MetaEntity extends BaseModel {
  @prop({ required: true })
  category!: string

  @prop()
  data?: any

  @prop({ required: true, ref: () => NamespaceEntity })
  namespace!: Ref<NamespaceEntity> | string
}

const MetaModel = getModelForClass(MetaEntity)

export { MetaEntity, MetaModel }
