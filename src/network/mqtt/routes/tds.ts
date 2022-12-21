import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updateTDS } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

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

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)
      const [id, projectId, value] = message.toString().split('/')

      subDebug(`\nTopic: ${topic} - Message received`)
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`Message: \t${message}\n`)
      updateTDS({ db, projectId, id, value: parseFloat(value) })
      socketConnection(subDebug).connect().emit('tds', parseFloat(value))
    }
  })
}

const totalDissolvedSolids: Route = {
  sub,
  SUB_TOPIC
}

export { totalDissolvedSolids }
