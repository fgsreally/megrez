import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from 'phecda-server'
import mongoose, { FilterQuery } from 'mongoose'
import { Auth } from '../../decorators/auth'
import type { TeamDTO } from './team.model'
import { TeamModel, TeamVO } from './team.model'
import { TeamService } from './team.service'

@Controller('/team')
@Auth()
export class TeamController<Data = any> {
  context: any
  constructor(protected teamService: TeamService) {

  }

  protected async isValid(team: any, user: any) {
    if (!team)
      throw new NotFoundException('无对应id的team')
    if (!team.users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以操作团队所属的命名空间')
  }

  @Get('')
  async findByUser() {
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

  @Post('/query')

  async query(@Body() query: FilterQuery<TeamDTO>) {
    const teams = await TeamModel.find(query)
    return teams.map(team => team.toJSON())
  }

  @Post('')
  async create(@Body() data: TeamVO) {
    const { request: { user } } = this.context
    const team = await this.teamService.create(data, user)

    return team.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context

    const ret = await TeamModel.updateOne({ _id: id, users: { $in: [user] } }, { data })
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

    await TeamModel.updateOne({
      id: teamId,
      users: { $in: [user] },
    }, { $push: { users: new mongoose.Types.ObjectId(userId) } })
    return true
  }
}
