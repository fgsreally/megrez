import { BadRequestException, Tag } from 'phecda-server'

import type { Ref } from '@typegoose/typegoose'
import type { TeamEntity } from '../team/team.model'
import { BaseSerice } from '../base/base.module'
import type { UserEntity } from '../user/user.model'
import type { NamespaceEntity } from './namespace.model'
import { NamespaceModel } from './namespace.model'

@Tag('namespace')
export class NamespaceService extends BaseSerice<typeof NamespaceEntity> {
  Model = NamespaceModel

  async create(user: UserEntity, name: string, team: Ref<TeamEntity>) {
    const namespace = await this.findByName(name, team)
    if (namespace)
      throw new BadRequestException('已有同名命名空间')
    return NamespaceModel.create({ name, creator: user, owner: user ,team})
  }

  async findByName(name: string, team: Ref<TeamEntity>) {
    const namespace = await NamespaceModel.findOne({ name, team })
    return namespace
  }
}
