import { describe, expect, it } from 'vitest'
import express from 'express'
import request from 'supertest'
import { Factory, addGuard, bindApp } from 'phecda-server'
import dotenv from 'dotenv'
import { jwtGuard } from '../src/index'
import { DbModule, NamespaceController, RecordController, TeamController, UserController } from '../src/modules'
describe('Route', async () => {
  dotenv.config()
  const data = await Factory([DbModule, UserController, TeamController, NamespaceController, RecordController])
  const app = express()
  app.use(express.json())
  addGuard('jwt', jwtGuard())
  bindApp(app, data, {
    globalGuards: ['jwt'],
  })

  let teamId: string
  let namespaceId: string
  let token: string
  it('login', async () => {
    const res = await request(app).post('/user/login').send({
      email: '1325041831@qq.com',
      password: '111111',
      data: {
        test: true,
      },
    })
    token = res.body.token
    expect(token).toBeDefined()
  })
  it('team and namespace', async () => {
    const res1 = await request(app).get('/team').set('Authorization', token)
    expect(res1.body.length).toBe(1)
    expect(res1.body[0].private).toBe(true)
    teamId = res1.body[0]._id
    const res2 = await request(app).post('/namespace').set('Authorization', token).send(
      {
        name: 'test',
        team: teamId,
      },
    )
    namespaceId = res2.body._id
    expect(namespaceId).toBeDefined()
  })

  it('record', async () => {
    const res1 = await request(app).post(`/record?namespace=${namespaceId}`).set('Authorization', token).send({
      type: 'test',
      data: {},
    })

    expect(res1.body._id).toBeDefined()
  })
})
