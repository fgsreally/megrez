import { Body, Controller, Get, Param, Post } from 'phecda-server'

import { Auth } from '../../decorators/auth'
import { NamespaceModel } from './namespace.model'
import { NamespaceService } from './namespace.service'

@Auth()
@Controller('/namespace')
export class NamespaceController {
  context: any
  constructor(private service: NamespaceService) {

  }

  @Get('/:team')
  async getAll(@Param('team') team: string) {
    const { request: { user } } = this.context
    return this.service.findByUserAndTeam(user, team)
  }

  @Post('/:team')
  async add(@Body('') namespace: {
    name: string
    description: string
    data: any
  }, @Param('team') team: string) {
    const { request: { user } } = this.context
    return this.service.create(user, namespace.name, team as any)
  }

  @Get('/:name')
  async get(@Param('name') name: string) {
    return this.service.findByName(name)
  }
}
