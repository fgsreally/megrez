import type { Ref } from '@typegoose/typegoose'
import { getModelForClass, pre, prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { BaseModel } from '../base/base.module'
import { UserEntity } from '../user/user.model'

@pre<TeamEntity>('save', function (next) {
  if (!this.users.length)
    this.users = [this.owner]
  next()
})
class TeamEntity extends BaseModel {
  @Rule((item: any) => !!item, '组织名不能为空')
  @prop({ required: true })
  name!: string

  @prop({ default: '' })
  description!: string

  @prop({ required: true, ref: () => UserEntity })
  users!: Ref<UserEntity>[]

  @prop()
  data!: any
}

const TeamModel = getModelForClass(TeamEntity)

export { TeamEntity, TeamModel }
