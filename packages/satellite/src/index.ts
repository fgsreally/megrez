import { fork } from 'child_process'
import type { Socket } from 'net'
import { connect } from 'net'
import { resolve } from 'path'

import HP from 'http-proxy'
import { COMMAND } from './common'
import { sendMessage } from './utils'
const proxy = HP.createProxyServer({})
const pipeFile
  = process.platform === 'win32' ? '\\\\.\\pipe\\mypip' : '/tmp/unix.sock'

let client: Socket

function getPortFromBridge(id: string) {
  return sendMessage(client, {
    type: COMMAND.DEBUG,
    id,
  })
}

export function init() {
  const child = fork(resolve(__dirname, 'bridge.js'), {
    env: {
      MEGREZ_SATELLITE: 'true',
      ...process.env,
    },
  })
  child.stdout?.pipe(process.stdout)
  child.stderr?.pipe(process.stderr)

  child.once('message', () => {
    client = connect(pipeFile)
  })
}

export function debug(cmd: string, options?: {
  prefix?: string
  max?: number
  duration?: number
}) {
  const { max = 10, duration = 1000000, prefix = 'debug' } = options || {}

  const RE = new RegExp(`\/${prefix}\/(.+)\/(.*)`)

  return async (req: any, res: any) => {
    if (process.env.MEGREZ_SATELLITE)
      return
    const [, id, pathname] = req.originalUrl.match(RE) || []

    if (id) {
      try {
        const ret = await getPortFromBridge(id)

        req.url = `/${pathname}`
        return proxy.web(req, res, {
          target: `${req.protocol}://0.0.0.0:${ret!.port}`,
        })
      }
      catch (e) {
        res.status(404).send('not id')
      }
    }
    else {
      const { id: uid, path } = await sendMessage(client, {
        type: COMMAND.DEBUG,
        max,
        duration,
        cmd,
      })
      res.send(`
      <body>
      <script>
      const origin=location.origin.split('://')[1] 
      const debugEl=document.createElement('div')
      const baseEl =document.createElement('div')
     
      baseEl.innerHTML="baseUrl: "+origin+"/${prefix}/${uid}/"
      debugEl.innerHTML="debugUrl: devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws="+origin+"/${prefix}/${uid}/${path}"
      document.body.append(baseEl)
      document.body.append(debugEl)
      </script>
      </body>
             `)
    }
  }
}

export function upgrade(options?: {
  prefix?: string
}) {
  const { prefix = 'debug' } = options || {}

  const RE = new RegExp(`\/${prefix}\/(.+)\/(.*)`)
  return async (req: any, socket: any, head: any) => {
    const [, id, pathname] = req.url.match(RE) || []
    if (id) {
      const ret = await getPortFromBridge(id)
      req.url = `/${pathname}`

      return proxy.ws(req, socket, head, {
        target: `ws://127.0.0.1:${ret!.debugPort}`,
      })
    }
  }
}

export function getToken(key: string, timeout: number) {
  return sendMessage(client, { key, timeout })
}
