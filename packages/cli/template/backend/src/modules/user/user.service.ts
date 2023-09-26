import { Tag } from 'phecda-server'
import type { UserVO } from '../user/user.model'
import { TeamService } from '../team/team.service'
import { UserModel } from './user.model'
@Tag('user')
export class UserService {
  Model = UserModel

  constructor(protected teamService: TeamService) {

  }

  async create(userInfo: UserVO) {
    const user = await UserModel.create(userInfo)
    await this.teamService.create({ name: userInfo.email }, user)
    return user
  }
}
