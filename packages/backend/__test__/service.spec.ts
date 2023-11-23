import { describe, expect, it } from 'vitest'
import { Factory } from 'phecda-server'
import type { DocumentType } from '@typegoose/typegoose'
import { NamespaceService } from '../src/modules/namespace/namespace.service'
import { AssetService } from '../src/modules/asset/asset.service'
import { TeamService } from '../src/modules/team/team.service'
import { UserService } from '../src/modules/user/user.service'
import type { UserDTO } from '../src/modules/user/user.model'
import type { TeamDTO } from '../src/modules/team/team.model'
import type { NamespaceDTO } from '../src/modules/namespace/namespace.model'
import { RecordService } from '../src/modules/record/record.service'
import { DbModule } from '../src/modules/db'
describe('Service', async () => {
  const data = await Factory([
    DbModule,
    RecordService,
    AssetService,
    NamespaceService,
    TeamService,
    UserService,
  ])
  let namespace: DocumentType<NamespaceDTO>, user: DocumentType<UserDTO>, team: DocumentType<TeamDTO>

  const User = data.moduleMap.get('user') as UserService
  const DB = data.moduleMap.get('DB') as DbModule
  const Team = data.moduleMap.get('team') as TeamService
  const Namespace = data.moduleMap.get('namespace') as NamespaceService
  const Asset = data.moduleMap.get('asset') as AssetService
  const Record = data.moduleMap.get('record') as RecordService
  it('User', async () => {
    user = await User.create({
      name: 'megrez user',
      uid: '1',
      data: {},
    })
    expect(await DB.user.countDocuments()).toBe(2)// admin + user
    expect(await DB.team.countDocuments()).toBe(1)
  })

  it('Team', async () => {
    team = await Team.create({
      name: 'megrez team', data: {},
    }, user)
    expect(await DB.team.countDocuments()).toBe(2)
  })
  it('Namespace', async () => {
    namespace = await Namespace.create({
      name: 'megrez namespace', data: {},
    }, team, user)
    expect(await DB.namespace.countDocuments()).toBe(1)
  })
  // it('Record', async () => {
  //   const record = await Record.model.create({
  //     type: 'test',
  //     data: { a: 1 },
  //     namespace,
  //   })
  //   record.data = { b: 2 }
  //   await record.save()

  //   expect(record.data).toEqual({ b: 2 })
  // })

  it('Auth', async () => {
    const user2 = await User.create({
      name: 'megrez user',
      uid: '2',
      data: {},
    })
    expect(() => Namespace.findOne(namespace._id.toString(), user2)).rejects.toThrowError()
    expect(await Namespace.findOne(namespace._id.toString(), user)).toBeDefined()
  })

  // it('add asset and create link', async () => {
  //   const asset1 = await Asset.create({
  //     name: 'asset1',
  //     type: 'test asset',

  //   }, namespace, user)
  //   const asset2 = await Asset.create({
  //     name: 'asset2',
  //     type: 'test asset',
  //   }, namespace,
  //   user)
  //   await Asset.createLink(asset1, asset2)
  //   const link = await LinkModel.findOne({
  //     namespace: namespace._id,
  //   })
  //   expect(link!.from.toString() === asset1.id).toBe(true)
  // })
})
