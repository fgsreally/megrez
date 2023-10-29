import { Init, NotFoundException, Tag } from 'phecda-server'
import { compareSync } from 'bcryptjs'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import type { DocumentType } from '@typegoose/typegoose'
import type { UserDTO, UserVO } from '../user/user.model'
import { UserModel } from '../user/user.model'
import { TeamService } from '../team/team.service'
import { ValidateCodeService } from './validateCode.service'

@Tag('user')
export class UserService {
  Model = UserModel
  admin: DocumentType<UserDTO>
  constructor(protected teamService: TeamService, protected codeService: ValidateCodeService) {

  }

  @Init
  async init() {
    const admin = await UserModel.findOne({ uid: '0' })
    if (!admin)
      this.admin = await UserModel.create({ uid: '0', name: 'admin' })
    else
      this.admin = admin
  }

  async create(userInfo: UserDTO) {
    const user = await UserModel.create(userInfo)
    await this.teamService.create({ name: userInfo.uid }, user)
    return user
  }

  async loginFromPassword({ email, password, data = {} }: UserVO) {
    const existingUser = await UserModel.findOne({ uid: email })
    if (existingUser) {
      if (!compareSync(password, existingUser.password!))
        throw new NotFoundException('密码不正确')

      return existingUser
    }
    else {
      const user = await this.create({ uid: email, password, name: email, data })

      return user
    }
  }

  async loginFromGithub(code: string) {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token?'
        + `client_id=${process.env.GITHUB_CLIENT_ID}&`
        + `client_secret=${process.env.GITHUB_CLIENT_SECRET}&`
        + `code=${code}`,
      headers: {
        accept: 'application/json',
      },
    })

    const accessToken = tokenResponse.data.access_token

    const result = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`,
      },
    })
    const { id, login, name } = result.data
    const existingUser = await UserModel.findOne({ uid: id })

    if (existingUser)
      return existingUser

    return this.create({
      uid: id,
      name: login || name,
      data: result.data,
    })
  }

  async loginFromCode(id: string, code: string) {
    if (code === this.codeService.getCode(id))
      return UserModel.findById(id)
  }

  createToken(user: UserDTO) {
    return jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: process.env.JWT_TIMEOUT || '3650d',
    })
  }
}
