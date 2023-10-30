import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { TeamService } from '../team/team.service'
import { NamespaceService } from '../namespace/namespace.service'
import { RecordModel } from '../record/record.model'
import type { AssetDTO } from './asset.model'
import { AssetModel, AssetVO, LinkModel } from './asset.model'
import { AssetService } from './asset.service'

@Auth()
@Controller('/asset')
export class AssetController<Data = any> {
  protected context: any

  constructor(protected assetService: AssetService<Data>, protected teamService: TeamService, protected namespaceService: NamespaceService) {

  }

  @Get('')
  async findByNamespace(@Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const assets = await AssetModel.find({
      namespace,
    })
    const relations = await RecordModel.find({ namespace })
    return {
      assets: assets.map(item => item.toJSON()),
      relations: relations.map(item => item.toJSON()),
    }
  }

  @Get('/:id')
  async findById(@Param('id') assetId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, user)
    return asset.toJSON() as AssetDTO<Data>
  }

  @Post('')
  async create(@Body('data') data: AssetVO<Data>, @Query('namespace') namespace: string) {
    const { request: { user } } = this.context
    const n = await this.namespaceService.findOne(namespace, user)

    const ret = await this.assetService.create(data, n, user)
    return ret.toJSON() as AssetDTO<Data>
  }

  @Put('/:id')
  async updateById(@Param('id') assetId: string, @Body() data: Data) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, user)
    asset.data = data
    await asset.save()

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') assetId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, user)

    await asset.deleteOne()
    return true
  }

  @Post('/link')
  async link(@Query('from') from: string, @Query('to') to: string) {
    const { request: { user } } = this.context

    const asset1 = await this.assetService.findOne(from, user)
    const asset2 = await this.assetService.findOne(to, user)

    await this.assetService.createLink(asset1, asset2)
  }

  @Delete('/link')
  async deleteLink(@Query('id') id: string) {
    const { request: { user } } = this.context
    const link = await LinkModel.findById(id)
    if (!link)
      throw new BadRequestException('不存在对应的relation')

    await this.namespaceService.findOne(link.namespace, user)
    await this.assetService.deleteLink(id)
  }
}
