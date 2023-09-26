import { BadRequestException, Tag } from 'phecda-server'
import type { TeamDoc } from '../team/team.model'
import type { UserDoc } from '../user/user.model'
import { NamespaceModel } from './namespace.model'

@Tag('namespace')
export class NamespaceService {
  Model = NamespaceModel
  async create(data: { name: string; data?: any }, team: TeamDoc, user: UserDoc) {
    if (await NamespaceModel.findOne({ name: data.name, team }))
      throw new BadRequestException('已存在同名空间')
    return NamespaceModel.create({
      ...data, team, creator: user, owner: user,
    })
  }
}
