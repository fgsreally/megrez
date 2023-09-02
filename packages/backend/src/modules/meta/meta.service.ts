import { BaseSerice } from '../base/base.module'
import type { MetaEntity } from './meta.model'
import { MetaModel } from './meta.model'

export class MetaService extends BaseSerice<typeof MetaEntity> {
  Model = MetaModel
}
