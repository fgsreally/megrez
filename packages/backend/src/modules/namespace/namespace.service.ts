import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { UserDTO } from '../user/user.model'
import { TeamService } from '../team/team.service'
import { DbModule } from '../db'
import type { TeamDTO } from '../team/team.model'
import type { NamespaceDTO } from './namespace.model'
@Tag('namespace')
export class NamespaceService {
  constructor(protected DB: DbModule, protected teamService: TeamService) {

  }

  async create(data: { name: string; data?: any }, team: DocumentType<TeamDTO>, user: DocumentType<UserDTO>) {
    if (await this.DB.namespace.findOne({ name: data.name, team }))
      throw new BadRequestException('已存在同名空间')
    return this.DB.namespace.create({
      ...data, team, creator: user, owner: user,
    })
  }

  async findOne(namespace: string | DocumentType<NamespaceDTO>, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof namespace === 'string') {
      const n = await this.DB.namespace.findById(namespace).populate({
        path: 'team',
        populate: 'users',
      })
      if (!n)
        throw new BadRequestException(`不存在id为${namespace}的namespace`)
      namespace = n
    }

    namespace.team = await this.teamService.findOne(namespace.team.toString(), user, auth)

    return namespace
  }
}
