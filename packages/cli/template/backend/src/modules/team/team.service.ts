import { BadRequestException, Tag } from 'phecda-server'
import { NamespaceService } from '../namespace/namespace.service'
import type { UserDTO, UserDoc } from '../user/user.model'
import type { TeamDoc, TeamVO } from './team.model'
import { TeamModel } from './team.model'
@Tag('team')
export class TeamService {
  Model = TeamModel

  constructor(protected namespaceService: NamespaceService) {

  }

  async create(data: TeamVO, user: UserDTO) {
    const team = await TeamModel.create({ ...data, owner: user, creator: user, users: [user] })
    await this.namespaceService.create({ name: 'default' }, team, team.owner as UserDTO)

    return team
  }

  async isValid(team: TeamDoc, user: UserDoc) {
    if (!team.users.includes(user._id))
      throw new BadRequestException('只有团队内的用户可以操作团队所属')
  }
}
