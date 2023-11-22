import Redis from 'ioredis'
import { Tag } from 'phecda-server'

@Tag('cache')
export class CacheModule extends Redis {
  constructor() {
    super(process.env.REDIS_URL)
  }

  async getJSON(key: string, cb: () => object) {
    const ret = await this.get(key)
    if (!ret) {
      const res = await cb()
      await this.set(key, JSON.stringify(res))
      return res
    }

    return JSON.parse(ret)
  }

  async occupy(category: string, key: string) {
    if (!await this.hexists(category, key))
      this.hset(category, key)
  }
}
