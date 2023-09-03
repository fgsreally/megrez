import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'

import { Auth } from '../../decorators/auth'

import type { TeamEntity } from '../team/team.model'
import { TeamModel } from '../team/team.model'
import type { UserEntity } from '../user/user.model'
import { NamespaceEntity, NamespaceModel } from './namespace.model'

@Auth()
@Controller('/namespace')
export class NamespaceController {
  protected context: any

  protected async isValid(namespace: any, user: any) {
    if (!namespace)
      throw new NotFoundException('无对应id的namespace')
    if (!(namespace.team as TeamEntity).users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以操作团队所属的命名空间')
  }

  @Get('')
  async findByTeam(@Query('teamId') teamId: string) {
    const { request: { user } } = this.context

    const team = await TeamModel.findById(teamId)
    if (!team)
      throw new NotFoundException('不存在对应team')

    if (!team.users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以查询团队所属的命名空间')

    const ret = await NamespaceModel.find({
      team,
    })

    return ret.map(item => item.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const { request: { user } } = this.context
    const ret = await NamespaceModel.findById(id).populate('team')

    await this.isValid(ret, user)
    return ret!.toJSON()
  }

  @Post('')
  async create(@Body() data: NamespaceEntity, @Query('teamId') teamId: string) {
    const { request: { user } } = this.context
    const team = await TeamModel.findById(teamId)
    if (!team)
      throw new NotFoundException('无对应id的team')
    if (!team.users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以查询团队所属的命名空间')
    data.team = team
    const ret = await NamespaceModel.create({ ...data, owner: user, creator: user })
    return ret.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: NamespaceEntity) {
    const { request: { user } } = this.context

    const ret = await NamespaceModel.findById(id)

    await this.isValid(ret, user)

    await ret!.updateOne(data)

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const ret = await NamespaceModel.findById(id)

    await this.isValid(ret, user)
    await ret!.deleteOne()
    return true
  }
}
