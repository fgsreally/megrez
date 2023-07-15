import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { UserEntity } from '../user/user.model'
import { AssetEntity } from '../asset/asset.model'

class NamespaceEntity {
  _id!: string

  @Rule((item: any) => !!item, '项目名不能为空')
  @prop({ required: true, unique: true })
  name!: string

  @prop({ required: true, ref: () => UserEntity })
  creator!: Ref<UserEntity>

  @prop({ default: [], ref: () => UserEntity })
  users!: Ref<UserEntity>[]

  @prop({ required: true, default: '' })
  description!: string

  @prop({ default: [], ref: () => AssetEntity })
   assets: Ref<AssetEntity>[]

  @prop()
  data!: any
}

const NamespaceModel = getModelForClass(NamespaceEntity)

export { NamespaceEntity, NamespaceModel }
