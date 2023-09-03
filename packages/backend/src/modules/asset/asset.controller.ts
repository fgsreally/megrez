import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { NamespaceModel } from '../namespace/namespace.model'
import type { TeamEntity } from '../team/team.model'
import { AssetEntity, AssetModel } from './asset.model'

@Auth()
@Controller('/asset')
export class AssetController {
  protected context: any

  protected async isValid(namespace: any, user: any) {
    if (!(namespace.team as TeamEntity).users.includes(user.id))
      throw new NotFoundException('只有团队内的用户可以操作团队所属的命名空间')
  }

  @Get('')
  async findByNamespace(@Query('namespaceId') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await NamespaceModel.findById(namespaceId)
    await this.isValid(namespace, user)

    const ret = await AssetModel.find({
      namespace,
    })

    return ret.map(item => item.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const ret = await AssetModel.findById(id).populate({ path: 'namespace', populate: { path: 'team' } })
    if (!ret)
      throw new NotFoundException('没有对应id的asset')
    await this.isValid(ret.namespace, user)

    return ret.toJSON()
  }

  @Post('')
  async create(@Body() data: AssetEntity, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await NamespaceModel.findById(namespaceId).populate('team')

    if (!namespace)
      throw new NotFoundException('无对应id的team')
    await this.isValid(namespace, user)
    data.namespace = namespace
    data.owner = data.creator = user
    const ret = await AssetModel.create(data)
    return ret.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: AssetEntity) {
    const { request: { user } } = this.context

    const ret = await AssetModel.findById(id).populate('namespace')

    if (!ret)
      throw new NotFoundException('无对应id的asset')
    await this.isValid(ret.namespace, user)
    await ret.updateOne(data)

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const ret = await AssetModel.findById(id).populate('namespace')

    if (!ret)
      throw new NotFoundException('无对应id的asset')
    await this.isValid(ret.namespace, user)
    ret.deleteOne()
    return true
  }
}
