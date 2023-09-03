import { getModelForClass, prop } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs'
import type { Types } from 'mongoose'
import { Rule } from 'phecda-server'

// export enum Permission {
//   ADMIN = 'admin',
//   USER = 'user',
// }
class UserEntity {
  _id!: Types.ObjectId

  @Rule((str: any) => str, '名称不能为空')
  @prop({ required: true })
  name!: string

  @Rule((str: string) => /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/.test(str), 'email不合法')
  @prop({ required: true })
  email!: string

  @prop({
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
