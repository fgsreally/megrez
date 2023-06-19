import { getModelForClass, prop } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs'
import type { Types } from 'mongoose'

export enum Permission {
  ADMIN = 'admin',
  USER = 'user',
}
class UserEntity {
  _id!: Types.ObjectId
  @prop({ required: true, enum: Permission })
  permission!: Permission

  @prop({ required: true })
  name!: string

  @prop({ required: true })
  email!: string

  @prop({
    select: false,
    get(val) {
      return val
    },
    set(val) {
      return val ? hashSync(val) : val
    },
  })
  password!: string
}

const UserModel = getModelForClass(UserEntity)

export { UserEntity, UserModel }
