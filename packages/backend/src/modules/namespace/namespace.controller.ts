import { Body, Controller, Get, Param, Post, Query } from 'phecda-server'

import { Auth } from '../../decorators/auth'
import { NamespaceService } from './namespace.service'

@Auth()
@Controller('/namespace')
export class NamespaceController {
  context: any
  constructor(private service: NamespaceService) {

  }

  @Get('')
  async get(@Query('name') name: string) {
    return this.service.findByName(name)
  }

  @Get('/team')
  async getAll(@Query('team') team: string) {
    const { request: { user } } = this.context
    return this.service.findByUserAndTeam(user, team)
  }

  @Post('/add')
  async add(@Body('data') namespace: {
    name: string
    description: string
    data?: any
  }, @Query('team') team: string) {
    const { request: { user } } = this.context
    return this.service.create(user, namespace.name, team as any)
  }
}
