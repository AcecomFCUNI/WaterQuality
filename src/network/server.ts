import debug from 'debug'

import { firebaseConnection } from 'database'
import { MAIN_TOPIC } from 'utils'
import { getClient, start as startMqtt } from './mqtt'
import { socketConnection } from './socket'

const namespace = `${MAIN_TOPIC}:Mqtt:Server`
const serverDebug = debug(namespace)

const start = async () => {
  firebaseConnection(serverDebug, () => socketConnection(serverDebug).connect())
  startMqtt(serverDebug)

  // TODO: this shouldn't be done in production
  if (process.env.NODE_ENV === 'production') {
    const { updateData } = await import('../jobs')

    updateData(getClient()).start()
    serverDebug(`Starting job: ${updateData.name}.`)
  }
}

export { start }
