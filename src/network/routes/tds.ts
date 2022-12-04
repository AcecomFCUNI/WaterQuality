import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const TOPIC = 'totalDissolvedSolids'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`WaterQuality:Mqtt:${TOPIC}:sub`)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('error', error => {
    subDebug(`Topic: ${SUB_TOPIC} - Error:`, error)
  })

  client.on('message', async (topic, message) => {
    subDebug(`Topic: ${topic} - Message received`)

    if (topic.includes(TOPIC)) {
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`\t${message.toJSON()}`)
    }
  })
}

const totalDissolvedSolids: Route = {
  sub,
  SUB_TOPIC
}

export { totalDissolvedSolids }
