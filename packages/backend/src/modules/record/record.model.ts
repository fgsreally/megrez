import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { NamespaceDTO } from '../namespace/namespace.model'
import { UserDTO } from '../user/user.model'

@modelOptions({ schemaOptions: { timestamps: true } })
export class RecordDto<Data = any> {
  createdAt?: Date

  @prop({ required: true })
  type!: string

  @prop({ ref: () => NamespaceDTO })
  namespace: Ref<NamespaceDTO>

  @prop({ ref: () => UserDTO })
  creator?: Ref<UserDTO>

  @prop({})
  data!: Data
}

export const RecordModel = getModelForClass(RecordDto)
