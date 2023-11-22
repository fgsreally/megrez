import type { P, ServerCtx } from 'phecda-server'
import { NotFoundException } from 'phecda-server'
import jwt from 'jsonwebtoken'
import type { DbModule } from '../modules'

export function jwtGuard(): P.Guard {
  return async (context: ServerCtx) => {
    const { request, meta: { data: { define: { auth } } }, moduleMap } = context
    const { headers } = request
    if (auth === false)
      return true

    try {
      const decodedToken: any = jwt.verify(headers.authorization || '', process.env.SECRET)

      const user = await (moduleMap.get('DB') as DbModule).user.findById(decodedToken.userId)

      if (!user)
        throw new NotFoundException('can\t find user');

      (request as any).user = user

      return true
    }
    catch (error) {
      throw new NotFoundException('token is wrong')
    }
  }
}
