import { toAsync, useC } from 'phecda-client'
import { AssetController } from '../../../backend/src/modules/asset/asset.controller'
import { $request } from './axios'

const instance = useC(AssetController)
export const addAsset = toAsync($request, instance.add)
export const getAsset = toAsync($request, instance.get)
