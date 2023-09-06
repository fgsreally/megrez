import { Factory, addGuard, bindApp } from 'phecda-server'
import express from 'express'
import dotenv from 'dotenv'
import { ConfigModule } from './modules/config/config.module'
import { AssetController } from './modules/asset/asset.controller'
import { NamespaceController } from './modules/namespace/namespace.controller'
import { TeamController } from './modules/team/team.controller'
import { jwtGuard } from './guards/jwt'
import { UserController } from './modules/user/user.controller'
import { logger } from './utils/logger'
dotenv.config()
async function start() {
  const data = await Factory([ConfigModule, UserController, TeamController, NamespaceController, AssetController])
  data.output()
  const app = express()
  // ServerContext.middlewareRecord.upload = uploadMiddleware
  app.use(express.json())
  addGuard('jwt', jwtGuard())

  bindApp(app, data, { globalGuards: ['jwt'] })

  app.listen(3699)
  logger.log('start listening...')
}

start()
