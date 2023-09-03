import { Body, Controller, Define, Get, NotFoundException, Post, Tag } from 'phecda-server'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { Auth } from '../../decorators/auth'
import { UserService } from './user.service'
import { UserEntity } from './user.model'

@Controller('/user')
@Auth()
export class UserController {
  constructor(private userService: UserService) {

  }

  context: any
  @Get('')
  async get() {
    return this.context.request.user as Omit<UserEntity, 'password'>
  }

  @Define('auth', false)
  @Post('/login')
  async login(@Body() { email, password, name }: UserEntity) {
    // 检查邮箱是否已被注册
    const existingUser = await this.userService.findByEmail(email)
    if (existingUser) {
      if (!compareSync(password, existingUser.password))
        throw new NotFoundException('密码不正确')
      const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...existingUser.toJSON() }
    }
    else {
      const user = await this.userService.create(name, email, password)

      // 创建 JWT Token，并返回给客户端
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: '3650d',
      })
      return { token, ...user.toJSON() }
    }

    // 创建用户
  }
}
