import { BadRequestException } from 'phecda-server'

export class ValidateCodeService {
  map: Record<string, string>
  addCode(id: string) {
    if (!(id in this.map)) {
      this.map[id] = randomCode(process.env.VALIDATE_CODE_LENGTH || 4)
      setTimeout(() => {
        delete this.map[id]
      }, Number(process.env.VALIDATE_CODE_TIMEOUT || 5 * 60 * 1000))
    }
    return this.map[id]
  }

  getCode(id: string) {
    if (!(id in this.map))
      throw new BadRequestException('尚未创建验证码或验证码已过期')

    return this.map[id]
  }
}
function randomCode(length: number | string) {
  length = Number(length)
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let result = '' // 统一改名: alt + shift + R
  for (let i = 0; i < length; i++) {
    const index = Math.ceil(Math.random() * 9)
    result += chars[index]
  }
  return result
}
