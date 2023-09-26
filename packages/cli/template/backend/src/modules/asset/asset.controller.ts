import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'
import { FilterQuery } from 'mongoose'
import { Auth } from '../../decorators/auth'
import type { NamespaceDTO } from '../namespace/namespace.model'
import { NamespaceModel } from '../namespace/namespace.model'
import type { TeamDTO } from '../team/team.model'
import { TeamService } from '../team/team.service'
import type { AssetDTO } from './asset.model'
import { AssetModel, AssetVO } from './asset.model'
import { AssetService } from './asset.service'

@Auth()
@Controller('/asset')
export class AssetController<Data = any> {
  protected context: any

  constructor(protected assetService: AssetService<Data>, protected teamService: TeamService) {

  }

  @Get('')
  async findByNamespace(@Query('namespaceId') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await NamespaceModel.findById(namespaceId).populate('team')
    if (!namespace)
      throw new NotFoundException('不存在对应namespace')
    await this.teamService.isValid(namespace.team as TeamDTO, user)

    const ret = await AssetModel.find({
      namespace,
    })

    return ret.map(item => item.toJSON()) as AssetDTO<Data>[]
  }

  @Post('/query')

  async query(@Body() query: FilterQuery<AssetDTO>) {
    const { request: { user } } = this.context

    const assets = await AssetModel.find(query).populate({ path: 'namespace', populate: { path: 'team' } })
    if (!assets)
      throw new NotFoundException('没有对应id的asset')

    assets.forEach(asset => this.teamService.isValid((asset.namespace as NamespaceDTO).team as TeamDTO, user))

    return assets.map(assert => assert.toJSON()) as AssetDTO<Data>[]
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const asset = await AssetModel.findById(id).populate({ path: 'namespace', populate: { path: 'team' } })
    if (!asset)
      throw new NotFoundException('没有对应id的asset')
    await this.teamService.isValid((asset.namespace as NamespaceDTO).team as TeamDTO, user)

    return asset.toJSON() as AssetDTO<Data>
  }

  @Post('')
  async create(@Body() data: AssetVO<Data>, @Query('namespace') namespaceID: string) {
    const { request: { user } } = this.context
    const namespace = await NamespaceModel.findById(namespaceID).populate('team')

    if (!namespace)
      throw new NotFoundException('无对应id的team')
    await this.teamService.isValid(namespace.team as TeamDTO, user)
    const ret = await this.assetService.create(data, namespace, user)
    return ret.toJSON() as AssetDTO<Data>
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context

    const asset = await AssetModel.findById(id).populate({
      path: 'namespace',
      populate: {
        path: 'team',
      },
    })

    if (!asset)
      throw new NotFoundException('无对应id的asset')

    await this.teamService.isValid((asset.namespace as NamespaceDTO).team as TeamDTO, user)
    await asset.updateOne({ data })

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    const { request: { user } } = this.context

    const asset = await AssetModel.findById(id).populate({
      path: 'namespace', populate: { path: 'team' },
    })

    if (!asset)
      throw new NotFoundException('无对应id的asset')
    await this.teamService.isValid((asset.namespace as NamespaceDTO).team as TeamDTO, user)
    asset.deleteOne()
    return true
  }
}
