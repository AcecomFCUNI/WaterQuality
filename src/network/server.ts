import debug from 'debug'

import { firebaseConnection } from 'database'
import { getClient, start as startMqtt } from './mqtt'
import { start as startSocket } from './socket'

const namespace = 'WaterQuality:Mqtt:Server'
const serverDebug = debug(namespace)

const start = async () => {
  startMqtt(serverDebug)
  firebaseConnection(serverDebug)
  startSocket(serverDebug)

  // TODO: this shouldn't be done in production
  if (process.env.NODE_ENV === 'production') {
    const { updateData } = await import('../jobs')

    // updateData(getClient()).start()
    serverDebug(`Starting job: ${updateData.name}`)
  }
}

export { start }
