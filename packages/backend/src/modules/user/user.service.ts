import { Tag } from 'phecda-server'
import { mongoose } from '@typegoose/typegoose'
import { TeamService } from '../team/team.service'
import { UserModel } from './user.model'
@Tag('user')
export class UserService {
  constructor() {

  }

  async create(name: string, email: string, password: string) {
    const user = await UserModel.create({ name, email, password, teams: [] })

    return user
    // permission: Permission.USER
  }

  findByEmail(email: string) {
    return UserModel.findOne({ email })// permission: Permission.USER
  }

  findById(id: string) {
    return UserModel.findById(id)
  }
}
