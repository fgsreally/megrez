import { toAsync, useC } from 'phecda-client'
import { UserController } from '../../../backend/src/modules/user/user.controller'
import { $request } from './axios'

const instance = useC(UserController)
export const login = toAsync($request, instance.login)
export const getUserInfo = toAsync($request, instance.get)
