import { Body, Controller, Define, Get, NotFoundException, Post, Tag } from 'phecda-server'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { UserService } from './user.service'
import type { UserEntity } from './user.model'

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {

  }

  context: any
  @Get('')
  async get() {
    return this.context.request.user as UserEntity
  }

  @Define('auth', false)
  @Post('/login')
  async login(@Body('name') name: string, @Body('email') email: string, @Body('password') password: string) {
    // 检查邮箱是否已被注册
    const existingUser = await this.userService.findByEmail(email)
    if (existingUser) {
      if (!compareSync(password, existingUser.password))
        throw new NotFoundException('密码不正确')
      const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET, {
        expiresIn: '1h',
      })
      return token
    }
    else {
      const user = await this.userService.create(name, email, password)
      // 创建 JWT Token，并返回给客户端
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: '1h',
      })
      return token
    }

    // 创建用户
  }
}
