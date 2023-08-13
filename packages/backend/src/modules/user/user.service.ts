import { Tag } from 'phecda-server'
import { TeamService } from '../team/team.service'
import { UserModel } from './user.model'
@Tag('user')
export class UserService {
  constructor(protected teamService: TeamService) {

  }

  async create(name: string, email: string, password: string) {
    const user = await UserModel.create({ name, email, password })
    await this.teamService.create(user, 'default', `${name}\'s default team`)

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
