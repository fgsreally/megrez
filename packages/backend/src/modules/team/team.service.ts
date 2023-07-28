import { Tag } from 'phecda-server'
import { BaseSerice } from '../base/base.module'
import type { UserEntity } from '../user/user.model'
import type { TeamEntity } from './team.model'
import { TeamModel } from './team.model'

@Tag('team')
export class TeamService extends BaseSerice<typeof TeamEntity> {
  Model = TeamModel
  create(user: UserEntity, teamName: string, description?: string) {
    return TeamModel.create({
      creator: user,
      owner: user,
      name: teamName,
      description,
    })
  }
}
