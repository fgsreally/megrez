import { Body, Controller, Get, Param, Post } from 'phecda-server'

import { ProjectModel } from './project.model'
import { Auth } from '@/decorators/auth'

@Auth()
@Controller('/project')
export class ProjectController {
  private project = ProjectModel

  constructor() {

  }

  @Post('')
  // @Middle('x-monitoring-system')
  async createProject(@Body() body: ProjectEntity) {
    return this.project.create(body)
  }

  @Get('/:name')
  async getProjectInfo(@Param('name') name: string) {
    return this.project.findByName(name)
  }
}
