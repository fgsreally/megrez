import { Factory, addGuard, addMiddleware, bindApp } from 'phecda-server'
import express from 'express'
import { UserController } from './controller/user.controller'
import { ConfigController } from './controller/config.controller'
import { UploadController } from './controller/upload.controller'
import { ProjectController } from './controller/project.controller'
import { InfoController } from './controller/info.controller'

import { jwtGuard } from './guards/jwt'
import { uploadMiddleware } from './middlewares/upload'
const data = await Factory([ConfigController, UserController, UploadController, ProjectController, InfoController])
data.output('pmeta.js')
const app = express()
// ServerContext.middlewareRecord.upload = uploadMiddleware
addMiddleware('upload', uploadMiddleware)
app.use(express.json())

addGuard('jwt', jwtGuard(data.moduleMap.get('user')!))

bindApp(app, data, { globalGuards: ['jwt'] })

export const viteNodeApp = app
