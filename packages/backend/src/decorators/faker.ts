import { Bind, Rule, getBind } from 'phecda-server'
import { fakerZH_CN } from '@faker-js/faker'
export const NoEmpty = (info = '不能为空') => Rule((item: any) => !!item, info)
export const isString = (info: string) => Rule((item: any) => typeof item === 'string' && item !== '', info)
export const Fake_Name = (target: any, key: PropertyKey) => Bind(fakerZH_CN.person.fullName)

export function createFakeData(target: any) {
  const ret = getBind(target)
  for (const i in ret)
    ret[i] = ret[i]()

  return ret
}
