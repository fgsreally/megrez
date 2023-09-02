import { Controller } from 'phecda-server'

import { Auth } from '../../decorators/auth'
import { BaseController } from '../base/base.controller'
import { MetaService } from './meta.service'
@Auth()
@Controller('/meta')
export class MetaController extends BaseController<MetaService> {
  constructor(protected service: MetaService) {
    super()
  }
}
