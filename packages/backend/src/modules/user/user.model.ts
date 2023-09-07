import { getModelForClass, prop } from '@typegoose/typegoose'
import { hashSync } from 'bcryptjs'
import { Rule } from 'phecda-server'
import { Any } from '../../decorators/faker'

export class UserDTO<Data = any> {
  _id: string

  @prop({ required: true, unique: true })
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

  @prop()
  data!: Data
}
export class UserVO<Data = any> {
  @Rule((str: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str), 'email不合法')

  email!: string

  @Rule((str: any) => str.length >= 6, '密码长度需大于等于6')
  password!: string

  @Any
  data?: Data
}

export const UserModel = getModelForClass(UserDTO)

export type UserDoc = InstanceType<typeof UserModel>
