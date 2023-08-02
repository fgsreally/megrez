
import { AssetController } from '../../../backend/src/modules/asset/asset.controller'



  

export  const addAsset = toAsync($request,useC(AssetController).add)



