import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const TOPIC = 'temperature'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`WaterQuality:Mqtt:${TOPIC}:sub`)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('error', error => {
    subDebug(`Topic: ${SUB_TOPIC} - Error:`, error)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      subDebug(`\nTopic: ${topic} - Message received`)
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`Message: \t${message}\n`)
    }
  })
}

const temperature: Route = {
  sub,
  SUB_TOPIC
}

export { temperature }
