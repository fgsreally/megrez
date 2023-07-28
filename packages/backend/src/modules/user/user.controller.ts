import { Body, Controller, Define, NotFoundException, Post, Tag } from 'phecda-server'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcryptjs'
import { UserModel } from './user.model'

@Tag('user')
@Controller('/user')
export class UserService {
  private model = UserModel
  constructor() {

  }

  @Define('auth', false)
  @Post('/register')
  async register(@Body('name') name: string, @Body('email') email: string, @Body('password') password: string) {
    // 检查邮箱是否已被注册
    const existingUser = await this.model.findOne({ email })
    if (existingUser)
      throw new NotFoundException('')
    // 创建用户
    const user = await this.create(name, email, password)
    // 创建 JWT Token，并返回给客户端
    const token = jwt.sign({ userId: user._id }, import.meta.env.VITE_SECRET, {
      expiresIn: '1h',
    })
    return token
  }

  async create(name: string, email: string, password: string) {
    const user = await this.model.create({ name, email, password })// permission: Permission.USER
    return user
  }

  @Define('auth', false)
  @Post('/login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    // 检查邮箱是否已被注册
    const user = await this.model.findOne({ email }).select('+password')
    if (!user)
      throw new NotFoundException('无对应用户')
    // 验证密码是否正确

    // const isPasswordCorrect = await user.comparePassword(password)
    if (!compareSync(password, user.password))
      throw new NotFoundException('密码不正确')

    // 创建 JWT Token，并返回给客户端
    const token = jwt.sign({ userId: user.id }, import.meta.env.VITE_SECRET, {
      expiresIn: '1h',
    })
    return token
  }
}
