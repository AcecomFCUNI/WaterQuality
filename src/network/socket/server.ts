import { getData } from 'database'
import { Debugger } from 'debug'
import { Server } from 'socket.io'

const PORT = parseInt(process.env.PORT as string) || 1996

const socketConnection = (d: Debugger) => ({
  connect: () => {
    if (!global.__io__) {
      let id: string
      let projectId: string

      global.__io__ = new Server(PORT, {
        allowRequest(req, fn) {
          const url = new URL(req?.url ?? '', `http://${req?.headers.host}`)
          const search = url.search.substring(1)
          const query = JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}'
          ) as { id: string; projectId: string }

          id = query.id
          projectId = query.projectId

          fn(null, true)
        },
        cors: {
          origin: ['http://localhost:3000', process.env.FRONT_URL as string]
        }
      })

      global.__io__.on('connection', async socket => {
        const db = global.__firebase__.database(
          process.env.FIREBASE_REAL_TIME_DB
        )
        const data = await getData({ db, id, projectId })

        socket.emit('initialData', data.val())
      })

      d(`Socket server started on port: ${PORT}.`)
    }

    return global.__io__
  },
  disconnect: () => {
    if (global.__io__) global.__io__.disconnectSockets(true)
  }
})

export { socketConnection }
