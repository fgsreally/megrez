import { Factory, addGuard, bindApp } from 'phecda-server'
import express from 'express'
import { ConfigModule } from './modules/config/config.module'
import { AssetController } from './modules/asset/asset.controller'
import { NamespaceController } from './modules/namespace/namespace.controller'
import { TeamController } from './modules/team/team.controller'
import { jwtGuard } from './guards/jwt'
import { UserController } from './modules/user/user.controller'
const data = await Factory([ConfigModule, UserController, AssetController, NamespaceController, TeamController])
data.output()
const app = express()
// ServerContext.middlewareRecord.upload = uploadMiddleware
app.use(express.json())

addGuard('jwt', jwtGuard(data.moduleMap.get('user')!))

bindApp(app, data, { globalGuards: ['jwt'] })

export const viteNodeApp = app
