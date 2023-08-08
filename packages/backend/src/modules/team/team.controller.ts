import { Body, Controller, Get, Post } from 'phecda-server'
import { TeamService } from './team.service'

@Controller('/team')
export class TeamController {
  context: any
  constructor(private service: TeamService) {

  }

  @Post('')
  add(@Body() data: { teamName: string; description?: string }) {
    const { request: { user } } = this.context
    return this.service.create(user, data.teamName, data.description)
  }

  @Get('')
  getTeams() {
    const { request: { user } } = this.context
    return this.service.findByUser(user)
  }
}
