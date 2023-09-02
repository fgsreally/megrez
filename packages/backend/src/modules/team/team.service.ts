import { Tag } from 'phecda-server'
import { mongoose } from '@typegoose/typegoose'
import { BaseSerice } from '../base/base.module'
import { UserService } from '../user/user.service'
import type { TeamEntity } from './team.model'
import { TeamModel } from './team.model'

@Tag('team')
export class TeamService extends BaseSerice<typeof TeamEntity> {
  Model = TeamModel

  constructor(protected userService: UserService) {
    super()
  }

  addUser(teamId: string, userId: string) {
    const user = this.userService.findById(userId)
    if (!user)
      throw new Error('不存在对应用户')
    return this.Model.updateOne({ _id: new mongoose.Types.ObjectId(teamId) }, {
      users: {
        $push: user,
      },
    })
  }
}
