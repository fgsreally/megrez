import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import { NamespaceService } from '../namespace/namespace.service'
import type { UserDTO, UserDoc } from '../user/user.model'
import type { TeamDTO, TeamVO } from './team.model'
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

  async findOne(team: DocumentType<TeamDTO> | string, user: UserDoc, auth: 'user' | 'owner' = 'user') {
    if (typeof team === 'string') {
      const t = await TeamModel.findById(team).populate('user').populate('owner').populate('creator')
      if (!t)
        throw new BadRequestException(`不存在id-${team}的team`)

      team = t
    }
    if (auth === 'user' && !team.users.some((u: any) => u._id === user._id!))
      throw new BadRequestException('只有团队内的用户可以操作团队所属')
    if (auth === 'owner' && !((team.owner as any)._id === user._id))
      throw new BadRequestException('只有团队内的用户可以操作团队所属')
    return team
  }
}
