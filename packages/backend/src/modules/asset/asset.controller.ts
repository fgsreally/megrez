import { Body, Controller, Delete, Get, Param, Post, Put, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { TeamService } from '../team/team.service'
import { NamespaceService } from '../namespace/namespace.service'
import type { AssetDTO } from './asset.model'
import { AssetModel, AssetVO } from './asset.model'
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

    const ret = await AssetModel.find({
      namespace,
    })

    return ret.map(item => item.toJSON()) as AssetDTO<Data>[]
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
  async updateById(@Param('id') assetId: string, @Body() data: Partial<Data>) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, user)
    await asset.updateOne({ data })

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') assetId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, user)

    await asset.deleteOne()
    return true
  }
}
