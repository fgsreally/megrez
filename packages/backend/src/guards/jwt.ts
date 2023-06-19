import type { P, ServerCtx } from 'phecda-server'
import { NotFoundException } from 'phecda-server'
import jwt from 'jsonwebtoken'
import type { UserController } from '../modules/user/user.controller'

export function jwtGuard(User: UserController): P.Guard {
  return async (context: ServerCtx) => {
    const { request, meta: { data: { define: { auth } } } } = context
    const { url, headers } = request
    if (!auth)
      return true

    if (url)
      return true
    try {
      const decodedToken: any = jwt.verify(headers.authorization, import.meta.env.VITE_SECRET)

      const user = await User.user.findById(decodedToken.userId)

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
