import { BadRequestException, Tag } from 'phecda-server'

import type { Ref } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import type { TeamEntity } from '../team/team.model'
import { BaseSerice } from '../base/base.module'
import type { UserEntity } from '../user/user.model'
import type { NamespaceEntity } from './namespace.model'
import { NamespaceModel } from './namespace.model'

@Tag('namespace')
export class NamespaceService extends BaseSerice<typeof NamespaceEntity> {
  Model = NamespaceModel

  async findByTeam(name: string, team: Ref<TeamEntity>) {
    return NamespaceModel.find({ name, team })
  }

  async findByUserAndTeam(user: Ref<UserEntity>, team: string) {
    return NamespaceModel.find({
      team: new mongoose.Types.ObjectId(team),
      users: {
        $in: [user],
      },
    })
  }
}
