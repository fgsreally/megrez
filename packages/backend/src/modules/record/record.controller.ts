import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from 'phecda-server'
import { FilterQuery } from 'mongoose'
import { Auth } from '../../decorators/auth'
import { NamespaceService } from '../namespace/namespace.service'
import { DbModule } from '../db'
import { RecordService } from './record.service'
import type { RecordDTO } from './record.model'

@Auth()
@Controller('/record')
export class RecordController<Data = any> {
  context: any
  constructor(protected recordService: RecordService, protected namespaceService: NamespaceService, protected DB: DbModule) { }
  @Get('')
  async get(@Query('namespace') namespaceId: string, @Query('page') page: number, @Query('limit') limit: number) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const records = await this.recordService.getByNamespace(namespace, page * limit, limit)
    return records as RecordDTO<Data>[]
  }

  @Post('')
  async create(@Body() data: { type: string; data: Data }, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const ret = await this.DB.record(namespaceId).create({ ...data, namespace, creator: user })
    return ret
  }

  @Post('/query')
  async query(@Body('namespace') namespaceId: string, @Body('query') query: FilterQuery<RecordDTO>, @Query('page', Number) page: number, @Query('limit', Number) limit: number) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const records = await this.recordService.queryByNamespace(namespace, query, page * limit, limit)

    return records as RecordDTO<Data>[]
  }

  @Get('/:id')
  async find(@Param('id') recordId: string, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context
    const record = await this.recordService.findOne(recordId, namespaceId, user)

    return record.toJSON()
  }

  @Patch('/:id')
  async patch(@Param('id') recordId: string, @Body('data') data: Partial<Data>, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const record = await this.recordService.findOne(recordId, namespaceId, user)
    record.data = Object.assign(record.data, data)

    return (await this.DB.record(namespaceId).findByIdAndUpdate(recordId, record, { new: true }))!.toJSON()
  }

  @Delete('/:id')
  async delete(@Param('id') recordId: string, @Query('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const record = await this.recordService.findOne(recordId, namespaceId, user)

    await record.deleteOne()
    return true
  }
}
