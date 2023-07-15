import { Body } from 'phecda-server'
import { NamespaceService } from '../namespace/namespace.service'
import { LangchainService } from '../langchain/langchain.service'
import { AssetEntity, AssetModel } from './asset.model'
import { Auth } from '@/decorators/auth'

@Auth()
export class AssetController {
  private Model = AssetModel
  private context: any
  constructor(private namespaceService: NamespaceService, private langchainService: LangchainService) {

  }

  async addAsset(@Body('namespace') namespace: string, @Body('asset') asset: AssetEntity) {
    const { request: { user } } = this.context
    asset.creator = user

    asset.namespace = (await this.namespaceService.findNamespace(namespace))[0]

    this.langchainService.addDocToVectorStore(asset.type, [asset.data])
    return new this.Model(asset).save()
  }
}
