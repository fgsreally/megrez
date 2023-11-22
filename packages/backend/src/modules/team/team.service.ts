import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { UserDTO } from '../user/user.model'
import { DbModule } from '../db'
import type { TeamDTO } from './team.model'
@Tag('team')
export class TeamService {
  constructor(protected DB: DbModule) {

  }

  async create(data: Partial<TeamDTO>, user: UserDTO) {
    const team = await this.DB.team.create({ ...data, owner: user, creator: user, users: [user] })
    // await this.namespaceService.create({ name: 'default' }, team, team.owner as UserDTO)

    return team
  }

  async findOne(team: DocumentType<TeamDTO> | string, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof team === 'string') {
      const t = await this.DB.team.findById(team).populate<UserDTO>('users').populate('owner').populate('creator')
      if (!t)
        throw new BadRequestException(`不存在id-${team}的team`)
      team = t
    }
    if (auth === 'user' && !team.users.some(u => u._id.equals(user._id)))
      throw new BadRequestException('只有团队内的用户可以操作团队所属')
    if (auth === 'owner' && !team.owner._id.equals(user._id))
      throw new BadRequestException('只有团队内的用户可以操作团队所属')
    return team
  }
}
