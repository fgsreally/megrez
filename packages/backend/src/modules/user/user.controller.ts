import { Body, Controller, Define, Get, Post, Put, Query } from 'phecda-server'

import { Auth } from '../../decorators/auth'
import type { UserDTO } from './user.model'
import { UserVO } from './user.model'
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
  async updateData(@Body() data: D) {
    const { user } = this.context.request
    await user.updateOne({ data })
    return user.toJSON() as Omit<UserDTO<D>, 'password'>
  }

  @Define('auth', false)
  @Post('/login')
  async login(@Body() vo: UserVO<D>) {
    const user = await this.userService.loginFromPassword(vo)
    return {
      token: this.userService.createToken(user),
      user: user.toJSON(),
    }
    // 创建用户
  }

  @Define('auth', false)
  @Post('/login/github')
  async loginGithub(@Query('code') code: string) {
    const user = await this.userService.loginFromGithub(code)
    return {
      token: this.userService.createToken(user),
      user: user.toJSON(),
    }
    // 创建用户
  }

  @Define('auth', false)
  @Post('/login/mail')
  async loginMail(@Query('userId') userId: string, @Query('code') code: string) {
    const user = await this.userService.loginFromCode(userId, code)
    return {
      token: this.userService.createToken(user!),
      user: user!.toJSON(),
    }
    // 创建用户
  }
}
