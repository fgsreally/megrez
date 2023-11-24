import { Ref, modelOptions, prop } from '@typegoose/typegoose'
import { NamespaceDTO } from '../namespace/namespace.model'
import { UserDTO } from '../user/user.model'
import { Base } from '../../types/utils'

@modelOptions({ schemaOptions: { timestamps: true } })
export class RecordDTO<Data = any> extends Base {
  @prop({ required: true })
  type!: string

  @prop({ ref: () => NamespaceDTO })
  namespace: Ref<NamespaceDTO>

  @prop({ ref: () => UserDTO })
  creator?: Ref<UserDTO>

  @prop({})
  data!: Data
}
