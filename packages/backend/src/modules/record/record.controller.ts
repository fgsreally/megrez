import { Body, Controller, Delete, Get, Param, Post, Query } from 'phecda-server'
import { Auth } from '../../decorators/auth'
import { NamespaceService } from '../namespace/namespace.service'
import { RecordService } from './record.service'
import { RecordModel } from './record.model'

@Auth()
@Controller('/record')
export class RecordController {
  context: any
  constructor(private recordService: RecordService, private namespaceService: NamespaceService) { }
  @Get('')
  async get(@Query('namespace') namespaceId: string, @Query('page', false) page = 0, @Query('limit', false) limit = 10) {
    const { request: { user } } = this.context
    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const records = await this.recordService.getByNamespace(namespace, page * limit, limit)
    return records.map(record => record.toJSON())
  }

  @Get('/:id')
  async findById(@Param('id') recordId: string) {
    const { request: { user } } = this.context
    const record = await this.recordService.findOne(recordId, user)

    return record.toJSON()
  }

  @Post('')
  async create(@Body('data') data: { type: string; data: any }, @Body('namespace') namespaceId: string) {
    const { request: { user } } = this.context

    const namespace = await this.namespaceService.findOne(namespaceId, user)

    const ret = await RecordModel.create({ ...data, namespace, creator: user })
    return ret
  }

  @Post('/:id')
  async updateById(@Param('id') recordId: string, @Body('data') data: any) {
    const { request: { user } } = this.context

    const record = await this.recordService.findOne(recordId, user)

    record.data = data
    await record.save()

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
