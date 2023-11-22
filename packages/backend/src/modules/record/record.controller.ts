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

  @Post('/query')
  async query(@Body('namespace') namespaceId: string, @Body('query') query: FilterQuery<RecordDTO>, @Query('page', Number) page: number, @Query('limit', Number) limit: number) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const records = await this.recordService.queryByNamespace(namespace, query, page * limit, limit)

    return records as RecordDTO<Data>[]
  }

  @Get('/:id')
  async findById(@Param('id') recordId: string) {
    const { request: { user } } = this.context
    const record = await this.recordService.findOne(recordId, user)

    return record.toJSON()
  }

  @Post('')
  async create(@Body('data') data: { type: string; data: Data }, @Body('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const ret = await this.DB.record.create({ ...data, namespace, creator: user })
    return ret
  }

  @Patch('/:id')
  async updateById(@Param('id') recordId: string, @Body('data') data: Partial<Data>) {
    const { request: { user } } = this.context

    const record = await this.recordService.findOne(recordId, user)
    record.data = Object.assign(record.data, data)

    await this.DB.record.findByIdAndUpdate(recordId, record, { new: true })

    return record.toJSON()
  }

  @Delete('/:id')
  async deleteById(@Param('id') recordId: string) {
    const { request: { user } } = this.context

    const record = await this.recordService.findOne(recordId, user)

    await record.deleteOne()
    return true
  }
}
