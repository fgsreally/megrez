import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { TeamEntity, TeamModel } from './team.model'

@Controller('/team')
@Auth()
export class TeamController {
  context: any

  protected async isValid(team: any, user: any) {
    if (!team)
      throw new NotFoundException('无对应id的team')
    if (!team.users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以操作团队所属的命名空间')
  }

  @Get('')
  async findUserTeams() {
    const { request: { user } } = this.context
    const ret = await TeamModel.find({
      users: {
        $in: [user],
      },
    })

    return ret.map(item => item.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const ret = await TeamModel.findById(id)
    if (!ret)
      throw new NotFoundException('无对应id的team')
    return ret.toJSON()
  }

  @Post('')
  async create(@Body() data: TeamEntity) {
    const { request: { user } } = this.context
    const ret = await TeamModel.create({ ...data, owner: user, creator: user, users: [user] })

    return ret.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: TeamEntity) {
    const { request: { user } } = this.context

    const ret = await TeamModel.updateOne({ _id: id, users: { $in: [user] } }, data)
    if (!ret)
      throw new NotFoundException('无对应id的team')

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    await TeamModel.deleteOne({ _id: id, users: { $in: [user] } })
    return true
  }

  @Post('/user')
  async addUser(@Body('') { teamId, userId }: { teamId: string; userId: string }) {
    const { request: { user } } = this.context

    await TeamModel.updateOne({ id: teamId, users: { $push: [userId], $in: [user] } })
    return true
  }
}
