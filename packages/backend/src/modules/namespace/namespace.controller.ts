import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'

import { FilterQuery } from 'mongoose'
import { Auth } from '../../decorators/auth'

import type { TeamDTO } from '../team/team.model'
import { TeamModel } from '../team/team.model'
import { TeamService } from '../team/team.service'
import type { NamespaceDTO } from './namespace.model'
import { NamespaceModel, NamespaceVO } from './namespace.model'
import { NamespaceService } from './namespace.service'

@Auth()
@Controller('/namespace')
export class NamespaceController<Data = any> {
  protected context: any
  constructor(protected namespaceService: NamespaceService, protected teamService: TeamService) {

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

    return ret.map(item => item.toJSON()) as NamespaceVO<Data>[]
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const { request: { user } } = this.context
    const namespace = await NamespaceModel.findById(id).populate('team')
    if (!namespace)
      throw new NotFoundException('没有对应id的namespace')
    await this.teamService.isValid(namespace.team as TeamDTO, user)
    return namespace!.toJSON() as NamespaceVO<Data>
  }

  @Post('/query')

  async query(@Body() query: FilterQuery<NamespaceDTO>, @Query('teamId') teamId?: string) {
    const { request: { user } } = this.context

    const namespaces = await NamespaceModel.find({ team: teamId, ...query }).populate('team')
    if (!namespaces)
      throw new NotFoundException('没有对应id的namespace')

    namespaces.forEach(namespace => this.teamService.isValid(namespace.team as TeamDTO, user))

    return namespaces.map(namespace => namespace.toJSON()) as NamespaceVO<Data>[]
  }

  @Post('')
  async create(@Body() data: NamespaceVO<Data>) {
    const { request: { user } } = this.context
    const team = await TeamModel.findById(data.team)
    if (!team)
      throw new NotFoundException('无对应id的team')
    if (!team.users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以查询团队所属的命名空间')
    const ret = await this.namespaceService.create(data, team, user)
    return ret.toJSON() as NamespaceVO<Data>
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context

    const namespace = await NamespaceModel.findById(id).populate('team')

    if (!namespace)
      throw new NotFoundException('不存在对应命名空间')
    await this.teamService.isValid(namespace.team as TeamDTO, user)

    await namespace!.updateOne({ data })

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const namespace = await NamespaceModel.findById(id)
    if (!namespace)
      throw new NotFoundException('不存在对应命名空间')

    await this.teamService.isValid(namespace.team as TeamDTO, user)
    await namespace!.deleteOne()
    return true
  }
}
