import { Body, Controller, Get, Post, Query } from 'phecda-server'
import { BaseController } from '../base/base.controller'
import { Auth } from '../../decorators/auth'
import { TeamService } from './team.service'

@Controller('/team')
@Auth()
export class TeamController extends BaseController<TeamService> {
  constructor(protected service: TeamService) {
    super()
  }

  @Post('/user')
  async addUser(@Body('') { teamId, userId }: { teamId: string; userId: string }) {
    await this.service.addUser(teamId, userId)
    return true
  }
}
