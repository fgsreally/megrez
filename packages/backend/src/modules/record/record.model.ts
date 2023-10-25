import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { NamespaceDTO } from '../namespace/namespace.model'

@modelOptions({ schemaOptions: { timestamps: true } })
export class RecordEntity<Data = any> {
  createdAt?: Date

  @prop({ required: true })
  type!: string

  @prop({ ref: () => NamespaceDTO })
  namespace?: Ref<NamespaceDTO>

  @prop({})
  data!: Data
}

export const RecordModel = getModelForClass(RecordEntity)
