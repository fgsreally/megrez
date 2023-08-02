import { Body, Controller, Get, Param, Post } from 'phecda-server'
import { NamespaceService } from '../namespace/namespace.service'
import { AssetEntity, AssetModel } from './asset.model'
import { AssetService } from './asset.service'
import { Auth } from '@/decorators/auth'

@Auth()
@Controller('/asset')
export class AssetController {
  private Model = AssetModel
  private context: any
  constructor(private namespaceService: NamespaceService, private assetService: AssetService) {

  }

  @Post('')
  async add(@Body('namespace') namespace: string, @Body('asset') asset: AssetEntity) {
    const { request: { user } } = this.context
    asset.creator = user

    asset.namespace = await this.namespaceService.findByName(namespace)

    // this.langchainService.addDocToVectorStore(asset.type, [asset.data])
    return new this.Model(asset).save()
  }

  @Get('/:namespace')
  async get(@Param('namespace') namespace: string) {
    return this.assetService.findByNamespace(namespace)
  }
}
