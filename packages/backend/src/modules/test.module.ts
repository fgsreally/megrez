import { Controller, Get } from 'phecda-server'

@Controller('/test')
export class TestModule {
  constructor() {

  }

  @Get('')
  test() {

  }
}
