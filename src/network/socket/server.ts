import { Debugger } from 'debug'
import { Server } from 'socket.io'

const start = (d: Debugger) => {
  const io = new Server(parseInt(process.env.PORT as string) || 1996, {
    allowRequest(req, fn) {
      d('request', req)
    }
  })

  io.on('connection', socket => {
    socket.emit('hello', 'world')
  })

  d('Socket server started.')

  return io
}

export { start }
