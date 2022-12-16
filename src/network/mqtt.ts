import mqtt from 'mqtt'
import debug from 'debug'

import { firebaseConnection } from 'database'

let client: mqtt.MqttClient
const options: mqtt.IClientOptions = {
  port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 0,
  host: process.env.MQTT_HOST,
  keepalive: 0,
  ...(process.env.NODE_ENV === 'development'
    ? {
        protocol: 'mqtt'
      }
    : {
        protocol: 'mqtts',
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASS
      })
}
const namespace = 'WaterQuality:Mqtt:Server'
const debugMessage = 'Connected to mqtt server'
const serverDebug = debug(namespace)

const getClient = () => {
  if (!client) {
    client = mqtt.connect(options)
    client.on('connect', () => {
      serverDebug(debugMessage)
    })
  }

  return client
}

const start = async () => {
  const { applyRoutes } = await import('./router')

  applyRoutes(getClient())
  firebaseConnection(serverDebug)

  // TODO: this shouldn't be done in production
  if (process.env.NODE_ENV === 'production') {
    const { updateData } = await import('../jobs')
    updateData(getClient()).start()
    serverDebug(`Starting job: ${updateData.name}`)
  }
}

const stop = async () => {
  getClient().end()
}

export { start, getClient, stop, namespace, debugMessage }
