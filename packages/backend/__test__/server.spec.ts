import { describe, expect, it } from 'vitest'
import { Factory } from 'phecda-server'
import { NamespaceService } from '../src/modules/namespace/namespace.service'
import { AssetService } from '../src/modules/asset/asset.service'
import { TeamService } from '../src/modules/team/team.service'
import { UserService } from '../src/modules/user/user.service'
import type { UserEntity } from '../src/modules/user/user.model'
import { UserModel } from '../src/modules/user/user.model'
import { TeamModel } from '../src/modules/team/team.model'
import type { NamespaceEntity } from '../src/modules/namespace/namespace.model'
import { NamespaceModel } from '../src/modules/namespace/namespace.model'
import { AssetModel } from '../src/modules/asset/asset.model'
import { ConfigModule } from './config.module'

describe('User/Team/Namespace', async () => {
  const data = await Factory([
    ConfigModule,
    AssetService,
    NamespaceService,
    TeamService,
    UserService,

  ])
  let namespace: NamespaceEntity, user: UserEntity
  const User = data.moduleMap.get('user') as UserService
  const Team = data.moduleMap.get('team') as TeamService
  const Namespace = data.moduleMap.get('namespace') as NamespaceService
  const Asset = data.moduleMap.get('asset') as AssetService

  it('create user/team/namespace', async () => {
    user = await User.create('fgs', '1325041831../srcqq.com', '1111111')
    expect(await UserModel.countDocuments()).toBe(1)
    const team = await Team.create(user, 'test', '1111111')
    expect(await TeamModel.countDocuments()).toBe(1)
    namespace = await Namespace.create(user, 'test', team)
    expect(await NamespaceModel.countDocuments()).toBe(1)
  })

  it('add asset and create link', async () => {
    const asset1 = await Asset.create(user, {
      name: 'asset1',
      category: 'test asset',
      namespace,
    } as any)
    const asset2 = await Asset.create(user, {
      name: 'asset2',
      category: 'test asset',
      namespace,
    } as any)
    expect(await AssetModel.countDocuments()).toBe(2)
    await Asset.createLink(asset1.id, asset2.id)
    const assets = await Asset.findByNamespace(namespace)
    expect(assets[0].dependences.length).toBe(0)
    expect(assets[1].invokers.length).toBe(0)
    expect(assets[0].invokers.length).toBe(1)
    expect(assets[1].dependences.length).toBe(1)
  })
})
