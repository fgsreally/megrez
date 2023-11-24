const http = require('http')

http
  .createServer((req, res) => {
    const pid = process.pid

    res.end(`handled by process.${pid}`)
  })
  .listen(process.env.port, () => {
    console.log('started process', process.env.port, process.pid)
  })
