import type { Ref } from '@typegoose/typegoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { BaseModel } from '../base/base.module'
import { UserDTO } from '../user/user.model'
import { Any } from '../../decorators/faker'

export class TeamDTO extends BaseModel {
  _id: string
  
  @prop({ required: true, unique: true })
  name!: string

  @prop({ required: true, ref: () => UserDTO })
  users!: Ref<UserDTO>[]

  @prop()
  data!: any
}

export class TeamVO {
  @Rule((item: any) => !!item, '组织名不能为空')
  name!: string

  @Any
  data?: any
}
export const TeamModel = getModelForClass(TeamDTO)
export type TeamDoc = InstanceType<typeof TeamModel>
