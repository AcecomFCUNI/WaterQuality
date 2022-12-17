import mqtt from 'mqtt'
import { Debugger } from 'debug'

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
const connectedMessage = 'Connected to mqtt server'
const disconnectedMessage = 'Connected to mqtt server'

const getClient = (d?: Debugger) => {
  if (!client) {
    client = mqtt.connect(options)
    client.on('connect', () => {
      d?.(connectedMessage)
    })
    client.on('disconnect', () => {
      d?.(disconnectedMessage)
    })
  }

  return client
}

const start = async (d: Debugger) => {
  const { applyRoutes } = await import('./router')

  applyRoutes(getClient(d))
}

const stop = async () => {
  getClient().end()
}

export { start, getClient, stop, connectedMessage, disconnectedMessage }
