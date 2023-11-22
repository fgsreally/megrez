import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { DbModule } from '../db'
import { TeamVO } from './team.model'
import { TeamService } from './team.service'

@Controller('/team')
@Auth()
export class TeamController<Data = any> {
  context: any
  constructor(protected teamService: TeamService, protected DB: DbModule) {

  }

  @Get('')
  async findByUser() {
    const { request: { user } } = this.context
    const ret = await this.DB.team.find({
      users: {
        $in: [user],
      },
    })

    return ret.map(item => item.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const ret = await this.DB.team.findById(id)
    if (!ret)
      throw new NotFoundException('无对应id的team')
    return ret.toJSON()
  }

  @Post('')
  async create(@Body() data: TeamVO) {
    const { request: { user } } = this.context
    const ret = await this.teamService.create(data, user)

    return ret.toJSON()
  }

  @Patch('/:id')
  async updateById(@Param('id') id: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context
    const team = await this.teamService.findOne(id, user, 'owner')

    team.data = Object.assign(team.data, data)
    await team.save()
    return team.toJSON()
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context
    const team = await this.teamService.findOne(id, user, 'owner')
    await team.deleteOne()
    return true
  }

  @Post('/user')
  async addUser(@Body('') { teamId, userId }: { teamId: string; userId: string }) {
    const { request: { user } } = this.context
    const newUser = await this.DB.user.findById(userId)
    if (!newUser)
      throw new BadRequestException(`不存在对应用户${userId}`)

    await this.DB.team.updateOne({
      id: teamId,
      users: { $in: [user] },
    }, { $push: { users: newUser } })
    return true
  }
}
