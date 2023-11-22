import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from 'phecda-server'

import { Auth } from '../../decorators/auth'

import { TeamService } from '../team/team.service'
import { DbModule } from '../db'
import { NamespaceVO } from './namespace.model'
import { NamespaceService } from './namespace.service'

@Auth()
@Controller('/namespace')
export class NamespaceController<Data = any> {
  protected context: any
  constructor(protected namespaceService: NamespaceService, protected teamService: TeamService, protected DB: DbModule) {

  }

  @Get('')
  async findByTeam(@Query('team') teamId: string) {
    const { request: { user } } = this.context

    const team = await this.teamService.findOne(teamId, user)

    const ret = await this.DB.namespace.find({
      team,
    })

    return ret.map(item => item.toJSON()) as NamespaceVO<Data>[]
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const namespace = await this.namespaceService.findOne(id, user)
    return namespace!.toJSON() as NamespaceVO<Data>
  }

  @Post('')
  async create(@Body() data: NamespaceVO<Data>) {
    const { request: { user } } = this.context
    const team = await this.teamService.findOne(data.team, user)

    const ret = await this.namespaceService.create(data, team, user)
    return ret.toJSON()
  }

  @Patch('/:id')
  async updateById(@Param('id') id: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context

    const namespace = await this.namespaceService.findOne(id, user, 'owner')

    namespace.data = Object.assign(namespace.data, data)
    await namespace.save()
    return namespace.toJSON()
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const namespace = await this.namespaceService.findOne(id, user, 'owner')

    await namespace!.deleteOne()
    return true
  }
}
