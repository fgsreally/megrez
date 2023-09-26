import { Ref, prop } from '@typegoose/typegoose'
import type { ReturnModelType } from '@typegoose/typegoose'
import { NotFoundException } from 'phecda-server'
import type { FilterQuery } from 'mongoose'
import { UserDTO } from '../user/user.model'

export class BaseModel {
  @prop({ required: true, ref: () => UserDTO })
  creator: Ref<UserDTO>

  @prop({ ref: () => UserDTO })
  owner: Ref<UserDTO>
}

export abstract class BaseSerice<T extends typeof BaseModel> {
  abstract Model: ReturnModelType<T>

  async find(filter: FilterQuery<InstanceType<T>>) {
    const entity = await this.Model.find(filter).populate('users').populate('owner').populate('creator')

    return entity
  }

  async findById(id: string) {
    return this.Model.findById(id).populate('owner').populate('creator').populate({ path: 'users', strictPopulate: false }).populate({ path: 'team', strictPopulate: false })
  }

  async create(obj: InstanceType<T>) {
    return new this.Model(obj).save()
  }

  async findByName(name: string) {
    const entity = await this.Model.findOne({ name })
    if (!entity)
      throw new NotFoundException('没有对应的name')

    return entity
  }

  async deleteById(id: string) {
    this.Model.deleteOne({ id })
    return true
  }

  async updateById(id: string, obj: InstanceType<T>) {
    return this.Model.findByIdAndUpdate(id, obj)
  }
}
