import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { TeamEntity } from '../team/team.model'
import { BaseModel } from '../base/base.module'

class NamespaceEntity extends BaseModel {
  _id!: string

  @Rule((item: any) => !!item, '名称不能为空')
  @prop({ required: true })
  name!: string

  @prop({ required: true, ref: () => TeamEntity })
  team!: Ref<TeamEntity>

  @prop({ default: '' })
  description!: string

  @prop()
  data!: any
}

const NamespaceModel = getModelForClass(NamespaceEntity)

export { NamespaceEntity, NamespaceModel }
