import debug from 'debug'
import { MqttClient } from 'mqtt'

import { socketConnection } from 'network/socket'
import { listenChangesInDate, updateDate } from 'database'
import { MAIN_TOPIC } from 'utils'

const TOPIC = 'date'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)
  const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)
  let subscribed = false

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const [id, moduleId, sensorId, , env] = message.toString().split('/')
      const isoDate = new Date().toISOString()

      subDebug(`Topic: ${topic} - Message received`)
      subDebug(`Received ${TOPIC.toUpperCase()} update at: ${isoDate}`)
      subDebug(`Message: \t${message}`)
      updateDate({
        db,
        moduleId,
        id,
        value: isoDate,
        sensorId,
        demo: env === 'demo'
      })
      socketConnection(subDebug).connect().emit(`${sensorId}/date`, isoDate)

      if (!subscribed) {
        listenChangesInDate({ db, id, moduleId, sensorId })
        subDebug(`Subscribed to changes in ${TOPIC.toUpperCase()}.`)
        subscribed = true
      }
    }
  })
}

const date: Route = {
  sub,
  SUB_TOPIC
}

export { date }
