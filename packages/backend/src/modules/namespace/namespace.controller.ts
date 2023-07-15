import { Body, Controller, Get, Param, Post } from 'phecda-server'

import { NamespaceEntity, NamespaceModel } from './namespace.model'
import { Auth } from '@/decorators/auth'

@Auth()
@Controller('/namespace')
export class NamespaceController {
  private Model = NamespaceModel

  constructor() {

  }

  @Post('')
  // @Middle('x-monitoring-system')
  async createProject(@Body() body: NamespaceEntity) {
    return this.Model.create(body)
  }

  @Get('/:name')
  async getProjectInfo(@Param('name') name: string) {
    return this.Model.find({ name })
  }
}
