import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { UserModel } from '../user/user.model'
import { TeamModel, TeamVO } from './team.model'
import { TeamService } from './team.service'

@Controller('/team')
@Auth()
export class TeamController<Data = any> {
  context: any
  constructor(protected teamService: TeamService) {

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

  @Post('')
  async create(@Body() data: TeamVO) {
    const { request: { user } } = this.context
    const ret = await this.teamService.create(data, user)

    return ret.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: Data) {
    const { request: { user } } = this.context
    const team = await this.teamService.findOne(id, user, 'owner')

    team.data = data
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
    const newUser = await UserModel.findById(userId)
    if (!newUser)
      throw new BadRequestException(`不存在对应用户${userId}`)

    await TeamModel.updateOne({
      id: teamId,
      users: { $in: [user] },
    }, { $push: { users: newUser } })
    return true
  }
}
