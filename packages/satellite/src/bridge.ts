import type { Socket } from 'net'
import { createServer } from 'net'
import type { ChildProcess } from 'child_process'
import { exec } from 'child_process'
import fs from 'fs'
import { createInterface } from 'readline'
import { nanoid } from 'nanoid'
import portfinder from 'portfinder'
import { COMMAND } from './common'

// won't return  value

export function createWritter(socket: Socket, id: string) {
  return (data: any) => {
    socket.write(JSON.stringify({ _id: id, data }))
  }
}
const pipeFile
  = process.platform === 'win32' ? '\\\\.\\pipe\\mypip' : '/tmp/unix.sock'
const portMap = new Map<string, { port: string; debugPort: string }>()
const processMap = new Map<string, ChildProcess>()
const tokenSet = new Set<string>()

function findPort() {
  return portfinder.getPortPromise()
}
const ipc = createServer((connection) => {
  connection.on('error', err => console.error(err.message))

  connection.on('data', async (buf) => {
    const { _id, data: { type, id, key, timeout, duration, cmd, max } } = JSON.parse(buf.toString())
    const write = createWritter(connection, _id)

    if (type === COMMAND.DEBUG) {
      if (id) {
        write(portMap.get(id))
        return
      }
      if (processMap.size > Number(max)) {
        write(false)

        return
      }

      const uuid = nanoid()
      const port: string = await findPort() as any
      const child = exec(cmd!, {
        env: {
          port,
          ...process.env,
        },
      })

      const rl = createInterface({
        input: child.stderr!,
        output: child.stdin!,
        terminal: false,
      })
      // 监听子进程输出，查找 WebSocket 链接
      rl.on('line', (line) => {
        // eslint-disable-next-line no-console
        console.log(line)
        // 检查输出是否包含 WebSocket 链接信息
        if (line.includes('Debugger listening on')) {
          // 提取 WebSocket 链接
          const matches = line.match(/ws:\/\/[^:]+:(\d+)\/(.*)/)

          if (matches && matches.length > 0) {
            portMap.set(uuid, { port, debugPort: matches[1] })
            processMap.set(uuid, child)
            write({ id: uuid, path: matches[2] })

            setTimeout(() => {
              child.kill()
              portMap.delete(uuid)
              processMap.delete(uuid)
            }, Number(duration))
          }
        }
      })
    }
    if (type === COMMAND.TOKEN) {
      if (tokenSet.has(key)) {
        write(false)
      }
      else {
        tokenSet.add(key)
        write(true)
        setTimeout(() => tokenSet.delete(key), timeout)
      }
    }
  })
  connection.on('error', err => console.error(err.message))
})

ipc.on('error', () => {
  process.send!('1')

  process.exit(0)
})
try {
  fs.unlinkSync(pipeFile)
}
catch (error) { }

ipc.listen(pipeFile, () => {
  process.send!('0')
})
