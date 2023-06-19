import { Ref, getModelForClass, prop } from '@typegoose/typegoose'
import { UserEntity } from '../user/user.model'
import { ProjectEntity } from '../project/project.model'
import { isString } from '../../decorators/faker'

class AssetEntity {
  _id!: string

  @isString('资产必须有名字')
  @prop({ required: true })
  name!: string

  @isString('资产必须存在类型')
  @prop({ required: true })
  type!: string

  @isString('必须存在所属项目')
  @prop({ required: true, ref: () => ProjectEntity, foreignField: 'name', localField: 'project' })
  project!: Ref<ProjectEntity>

  @prop({ required: true, ref: () => UserEntity })
  creator!: Ref<UserEntity>

  @prop({ required: true, ref: () => AssetEntity })
  dependences!: Ref<AssetEntity>[]

  @prop({ required: true, ref: () => AssetEntity })
  depended!: Ref<AssetEntity>[]
}

const AssetModel = getModelForClass(AssetEntity)

export { AssetEntity, AssetModel }
