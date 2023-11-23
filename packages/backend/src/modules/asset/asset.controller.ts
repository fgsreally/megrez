import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { TeamService } from '../team/team.service'
import { NamespaceService } from '../namespace/namespace.service'
import { DbModule } from '../db'
import type { AssetDTO } from './asset.model'
import { AssetVO } from './asset.model'
import { AssetService } from './asset.service'

@Auth()
@Controller('/asset')
export class AssetController<Data = any> {
  protected context: any

  constructor(protected DB: DbModule, protected assetService: AssetService<Data>, protected teamService: TeamService, protected namespaceService: NamespaceService) {

  }

  @Get('')
  async findByNamespace(@Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const assets = await this.DB.asset(namespaceId).find({
      namespace,
    })
    return assets
  }

  @Get('/:id')
  async findById(@Param('id') assetId: string, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, namespaceId, user)
    return asset.toJSON() as AssetDTO<Data>
  }

  @Post('')
  async create(@Body('data') data: AssetVO<Data>, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    await this.namespaceService.findOne(namespaceId, user)

    const ret = await this.assetService.create(data, namespaceId, user)
    return ret.toJSON() as AssetDTO<Data>
  }

  @Patch('/:id')
  async updateById(@Param('id') assetId: string, @Body() data: Partial<Data>, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, namespaceId, user)
    asset.data = Object.assign(asset.data, data)
    await asset.save()

    return true
  }

  @Delete('/:id')
  async deleteById(@Param('id') assetId: string, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const asset = await this.assetService.findOne(assetId, namespaceId, user)

    await asset.deleteOne()
    return true
  }
}
