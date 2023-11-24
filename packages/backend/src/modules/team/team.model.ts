import type { Ref } from '@typegoose/typegoose'
import { prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { BaseModel } from '../base/base.module'
import { UserDTO } from '../user/user.model'
import { Any } from '../../decorators/faker'

export class TeamDTO extends BaseModel {
  @prop({ required: true, unique: true })
  name!: string

  @prop({ required: true, ref: () => UserDTO })
  users!: Ref<UserDTO>[]

  @prop({ default: false })
  private!: boolean

  @prop()
  data!: any
}

export class TeamVO<T> {
  @Rule((item: any) => !!item, '组织名不能为空')
  name!: string

  @Any
  data?: T
}
