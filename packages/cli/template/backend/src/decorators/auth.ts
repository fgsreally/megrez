import { Define } from 'phecda-server'

export function Auth(role = 'user') {
  return Define('auth', role)
}
