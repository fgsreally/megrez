import { BadRequestException } from 'phecda-server'
import type { TeamDoc } from '../team/team.model'
import type { UserDoc } from '../user/user.model'
import { NamespaceModel } from './namespace.model'
export class NamespaceService {
  async create(data: { name: string; data?: any }, team: TeamDoc, user: UserDoc) {
    if (await NamespaceModel.findOne({ name: data.name }))
      throw new BadRequestException('已存在同名空间')
    return NamespaceModel.create({
      ...data, team, creator: user, owner: user,
    })
  }
}
