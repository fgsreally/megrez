import { toAsync, useC } from 'phecda-client'
import { NamespaceController } from '../../../backend/src/modules/namespace/namespace.controller'
import { $request } from './axios'

const instance = useC(NamespaceController)
export const addNamespace = toAsync($request, instance.add)
export const getNamespace = toAsync($request, instance.get)
export const getAllNamespace = toAsync($request, instance.getAll)
