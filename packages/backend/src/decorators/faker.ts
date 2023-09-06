import { Bind, Rule, getBind } from 'phecda-server'

export const NoEmpty = (info = '不能为空') => Rule((item: any) => !!item, info)
export const Any = Rule(() => true, '')

export const isString = (info?: string) => Rule((item: any) => typeof item === 'string' && item !== '', info || (k => `${k}需要为一个字符串`))
// export const Fake_Name = (target: any, key: PropertyKey) => Bind(fakerZH_CN.person.fullName)

export function createFakeData(target: any) {
  const ret = getBind(target)
  for (const i in ret)
    ret[i] = ret[i]()

  return ret
}
