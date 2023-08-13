import { Ref, prop } from '@typegoose/typegoose'
import type { ReturnModelType } from '@typegoose/typegoose'
import { NotFoundException } from 'phecda-server'
import { UserEntity } from '../user/user.model'

export class BaseModel {
  @prop({ required: true, ref: () => UserEntity })
  creator!: Ref<UserEntity>

  @prop({ default: [], ref: () => UserEntity })
  users!: Ref<UserEntity>[]

  @prop({ required: true, ref: () => UserEntity })
  owner!: Ref<UserEntity>
}

export abstract class BaseSerice<T extends typeof BaseModel> {
  abstract Model: ReturnModelType<T>

  async findByName(name: string) {
    const entity = await this.Model.findOne({ name })
    if (!entity)
      throw new NotFoundException('没有对应的name')

    return entity
  }

  async findById(id: string) {
    const entity = await this.Model.findById(id)
    if (!entity)
      throw new NotFoundException('没有对应的id')

    return entity
  }

  async addUsers(users: Ref<UserEntity>[], name: string) {
    const entity = await this.findByName(name)
    entity.users.concat(users)
    return entity.save()
  }

  async updateOwner(user: Ref<UserEntity>, name: string) {
    const entity = await this.findByName(name)
    entity.owner = user
    return entity.save()
  }
}
