import { getModelForClass, prop } from '@typegoose/typegoose'
import { Rule } from 'phecda-server'
import { BaseModel } from '../base/base.module'

class TeamEntity extends BaseModel {
  _id!: string

  @Rule((item: any) => !!item, '组织名不能为空')
  @prop({ required: true, unique: true })
  name!: string

  @prop({ default: '' })
  description!: string

  @prop()
  info!: any
}

const TeamModel = getModelForClass(TeamEntity)

export { TeamEntity, TeamModel }
