import type { P, ServerCtx } from 'phecda-server'
// ban module method
export function BanGuard(ban: Record<string, string[]> = {}): P.Guard {
  return async (context: ServerCtx) => {
    const {
      meta: {
        data: {
          method,
          tag,
        },
      },
    } = context

    if (tag in ban && ban[tag].includes(method))
      return false

    return true
  }
}
