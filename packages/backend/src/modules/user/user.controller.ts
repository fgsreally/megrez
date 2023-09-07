import { Body, Controller, Define, Get, NotFoundException, Post, Put } from 'phecda-server'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { Auth } from '../../decorators/auth'
import type { UserDTO } from './user.model'
import { UserModel, UserVO } from './user.model'
import { UserService } from './user.service'

@Controller('/user')
@Auth()
export class UserController<D> {
  context: any

  constructor(protected userService: UserService) {

  }

  @Get('')
  async get() {
    return this.context.request.user as Omit<UserDTO<D>, 'password'>
  }

  @Put('')
  async update(@Body() data: D) {
    const { user } = this.context.request
    await user.updateOne({ data })
    return user.toJSON() as Omit<UserDTO<D>, 'password'>
  }

  @Define('auth', false)
  @Post('/login')
  async login(@Body() { email, password }: UserVO<D>) {
    // 检查邮箱是否已被注册
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      if (!compareSync(password, existingUser.password))
        throw new NotFoundException('密码不正确')
      const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...existingUser.toJSON() as Omit<UserDTO<D>, 'password'> }
    }
    else {
      const user = await this.userService.create({ email, password })
      // 创建 JWT Token，并返回给客户端
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...user.toJSON() as Omit<UserDTO<D>, 'password'> }
    }

    // 创建用户
  }
}
