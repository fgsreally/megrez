import { Body, Controller, Define, Get, NotFoundException, Post } from 'phecda-server'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { Auth } from '../../decorators/auth'
import { TeamService } from '../team/team.service'
import type { UserDTO } from './user.model'
import { UserModel, UserVO } from './user.model'

@Controller('/user')
@Auth()
export class UserController {
  context: any

  constructor(protected teamService: TeamService) {

  }

  @Get('')
  async get() {
    return this.context.request.user as Omit<UserDTO, 'password'>
  }

  @Define('auth', false)
  @Post('/login')
  async login<D>(@Body() { email, password }: UserVO<D>) {
    // 检查邮箱是否已被注册
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      if (!compareSync(password, existingUser.password))
        throw new NotFoundException('密码不正确')
      const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...existingUser.toJSON() }
    }
    else {
      const user = await UserModel.create({ email, password })
      await this.teamService.create({ name: email }, user)
      // 创建 JWT Token，并返回给客户端
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...user.toJSON() }
    }

    // 创建用户
  }
}
