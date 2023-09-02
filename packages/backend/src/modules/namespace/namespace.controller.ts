import { Controller } from 'phecda-server'

import { Auth } from '../../decorators/auth'
import { BaseController } from '../base/base.controller'

import { NamespaceService } from './namespace.service'

@Auth()
@Controller('/namespace')
export class NamespaceController extends BaseController<NamespaceService> {
  constructor(protected service: NamespaceService) {
    super()
  }
}
