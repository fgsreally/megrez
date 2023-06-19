import { getModelForClass, prop } from '@typegoose/typegoose'
import { ProjectModel } from './dto/project.model'

export function createDynamicModel({ fields }: { fields: Record<string, any> }) {
  class DynamicModel {
    constructor(fields: Record<string, any>) {
      Object.assign(this, fields)
    }
  }

  for (const [fieldName, fieldOptions] of Object.entries(fields))

    prop(Object.assign(fieldOptions, { type: String }))(DynamicModel.prototype, fieldName)

  prop({ ref: () => ProjectModel })(DynamicModel.prototype, 'project')

  return getModelForClass(DynamicModel, { })
}

// // 示例：创建一个包含"name"和"age"字段的model
// const DynamicModel = createDynamicModel('myCollection', { name: { type: String }, age: { type: Number } })

// // 创建一个实例并保存到数据库
// const doc = new DynamicModel({ name: 'John', age: 30 })
// await doc.save()

// // 查询数据库
// const result = await DynamicModel.findOne({ name: 'John' })
