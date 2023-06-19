export function mergeOptions(obj1: any, obj2?: any) {
  if (!obj2)
    return obj1

  for (const i in obj2) {
    if (isObject(obj1[i]) && isObject(obj2[i])) {
      mergeOptions(obj1[i], obj2[i])
      continue
    }
    if (Array.isArray(obj1[i]) && Array.isArray(obj2[i])) {
      obj1[i].push(...obj2[i].filter((item: any) => !obj1[i].includes(item)))
      continue
    }
    obj1[i] = obj2[i]
  }
  return obj1
}

function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
