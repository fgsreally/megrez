import type { Socket } from 'net'

import { nanoid } from 'nanoid'

export async function sendMessage(socket: Socket, data: any) {
  return new Promise<any>((resolve, reject) => {
    const id = nanoid()

    socket.on('data', cb)
    function cb(ret: any) {
      ret = JSON.parse(ret.toString())
      if (ret._id === id) {
        if (ret.data === false)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()

        else
          resolve(ret.data)

        socket.off('data', cb)
      }
    }

    socket.write(JSON.stringify({ _id: id, data }))
  })
}
