import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updateTurbidity } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'turbidity'
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
      const date = new Date()

      subDebug(`\nTopic: ${topic} - Message received`)
      subDebug(`Received a ${TOPIC} update at: ${new Date().toISOString()}`)
      subDebug(`Message: \t${message}\n`)
      updateTurbidity({
        db,
        id,
        projectId,
        value: parseFloat(value),
        date
      })
      socketConnection(subDebug)
        .connect()
        .emit('turbidity', {
          value: parseFloat(value),
          date: date.toISOString()
        })
    }
  })
}

const turbidity: Route = {
  sub,
  SUB_TOPIC
}

export { turbidity }
