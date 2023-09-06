import { type Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { TeamDTO } from '../team/team.model'
import { BaseModel } from '../base/base.module'
import { Any, isString } from '../../decorators/faker'

export class NamespaceDTO<Data = any> extends BaseModel {
  _id: string

  @prop({ required: true })
  name!: string

  @prop({ required: true, ref: () => TeamDTO })
  team!: Ref<TeamDTO>

  @prop()
  data!: Data
}
export class NamespaceVO<Data = any> {
  @isString()
  name!: string

  @isString()
  team!: string

  @Any
  data?: Data
}

export const NamespaceModel = getModelForClass(NamespaceDTO)
export type NamespaceDoc = InstanceType<typeof NamespaceModel>
