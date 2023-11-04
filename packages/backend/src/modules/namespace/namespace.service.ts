import { BadRequestException, Tag } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import type { TeamDoc } from '../team/team.model'
import type { UserDTO } from '../user/user.model'
import { TeamService } from '../team/team.service'
import type { NamespaceDTO } from './namespace.model'
import { NamespaceModel } from './namespace.model'
@Tag('namespace')
export class NamespaceService {
  Model = NamespaceModel

  constructor(private teamService: TeamService) {

  }

  async create(data: { name: string; data?: any }, team: TeamDoc, user: DocumentType<UserDTO>) {
    if (await NamespaceModel.findOne({ name: data.name, team }))
      throw new BadRequestException('已存在同名空间')
    return NamespaceModel.create({
      ...data, team, creator: user, owner: user,
    })
  }

  async findOne(namespace: string | DocumentType<NamespaceDTO>, user: DocumentType<UserDTO>, auth: 'user' | 'owner' = 'user') {
    if (typeof namespace === 'string') {
      const n = await NamespaceModel.findById(namespace).populate({
        path: 'team',
        populate: 'users',
      })
      if (!n)
        throw new BadRequestException(`不存在id为${namespace}的namespace`)
      namespace = n
    }

    namespace.team = await this.teamService.findOne(namespace.team, user, auth)

    return namespace
  }
}
