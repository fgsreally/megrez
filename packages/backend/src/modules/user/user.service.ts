import { Tag } from 'phecda-server'
import { UserModel } from './user.model'
@Tag('user')
export class UserService {
  async create(name: string, email: string, password: string) {
    return UserModel.create({ name, email, password })// permission: Permission.USER
  }

  findByEmail(email: string) {
    return UserModel.findOne({ email })// permission: Permission.USER
  }

  findById(id: string) {
    return UserModel.findById(id)
  }
}
