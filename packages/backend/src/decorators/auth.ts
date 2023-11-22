import { Define } from 'phecda-server'

export function Auth(role: any = 'user') {
  return Define('auth', role)
}

export const NS = Define('namespace', true)
