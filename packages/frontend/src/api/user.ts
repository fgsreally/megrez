import { toAsync, useC } from 'phecda-client'
import { UserService } from '../../../backend/src/modules/user/user.controller'
import { $request } from './axios'

const instance = useC(UserService)
export const register = toAsync($request, instance.register)
export const login = toAsync($request, instance.login)
export const getUserInfo = toAsync($request, instance.get)
