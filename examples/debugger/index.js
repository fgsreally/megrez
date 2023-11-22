const cluster = require('cluster')
const { init, debug, upgrade } = require('megrez-satellite')
const express = require('express')

const app = express()

if (cluster.isMaster) {
  for (let i = 0; i < 4; i++)
    cluster.fork()
}
else {
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    next()
  })
  app.use(express.json())

  init()
  app.use('/test', (req, res) => {
    res.end(`${cluster.worker.id}`)
  })
  app.use('/debug*', debug('node --inspect test.js'))
  const port = process.env.PORT || 3000

  const server = app.listen(port, () => {
    console.log(`Worker ${cluster.worker.id} is listening on port ${port}`)
  })

  server.on('upgrade', upgrade()) // optional: upgrade externally
}
