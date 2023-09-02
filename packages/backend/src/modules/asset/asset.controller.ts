import { Body, Controller, Get, Param, Post } from 'phecda-server'
import { NamespaceService } from '../namespace/namespace.service'
import { Auth } from '../../decorators/auth'
import { AssetEntity, AssetModel } from './asset.model'
import { AssetService } from './asset.service'

@Auth()
@Controller('/asset')
export class AssetController {
  private Model = AssetModel
  private context: any
  constructor(private namespaceService: NamespaceService, private assetService: AssetService) {

  }

  @Post('')
  async addAsset(@Body('namespace') namespace: string, @Body('asset') asset: AssetEntity) {
    const { request: { user } } = this.context
    asset.owner = asset.creator = user
    // asset.namespace = await this.namespaceService.findById(namespace)

    return new this.Model(asset).save()
  }

  @Get('/:namespace')
  async getAssetByNamespace(@Param('namespace') namespace: string) {
    return this.assetService.findByNamespace(namespace)
  }
}
