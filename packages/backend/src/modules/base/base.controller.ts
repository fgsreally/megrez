import { Body, Delete, Get, NotFoundException, Param, Post, Put, Query } from 'phecda-server'
import type { BaseSerice } from './base.module'

export class BaseController<S extends BaseSerice<any>> {
  context: any
  protected service: S
  constructor() {

  }

  @Get('')
  async find(@Query('') filter: Parameters<S['find']>[0]) {
    const ret = await this.service.find(filter)

    return ret.map(item => item.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const ret = await this.service.findById(id)
    if (!ret)
      throw new NotFoundException('无对应id')
    return ret.toJSON()
  }

  @Post('')
  async create(@Body() data: Omit<Parameters<S['create']>[0], 'creator' | 'owner'>) {
    const { request: { user } } = this.context
    const ret = await this.service.create({ ...data, owner: user, creator: user })

    return ret.toJSON()
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: Parameters<S['updateById']>[1]) {
    const ret = await this.service.updateById(id, data)
    if (!ret)
      throw new NotFoundException('无对应id')

    return ret.toJSON()
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    return this.service.deleteById(id)
  }
}
