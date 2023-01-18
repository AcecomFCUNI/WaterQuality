import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const clients = [
  {
    id: '95008c5b-db0f-442f-99c0-4dc06562a91a',
    moduleId: 3,
    sensorId: 2
  },
  {
    id: 'bec5d8bf-1b42-4014-a72d-2c864a5a89d1',
    moduleId: 4,
    sensorId: 3
  }
]

const randomInInterval = (min: number, max: number, fix = 2): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

const updateData = (client: MqttClient) => {
  let errorRegistered = false

  cron.schedule('*/10 * * * * *', async (): Promise<void> => {
    const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)

    pubDebug(`Job started at: ${new Date().toISOString()}`)

    if (!errorRegistered) {
      client.on('error', error => {
        pubDebug('Error: ', error)
      })
      errorRegistered = true
    }

    clients.forEach(({ id, moduleId, sensorId }) => {
      client.publish(
        `${MAIN_TOPIC}/pH`,
        `${id}/${moduleId}/${sensorId}/${randomInInterval(6.5, 7.5, 1)}`,
        () => {
          client.publish(
            `${MAIN_TOPIC}/tds`,
            `${id}/${moduleId}/${sensorId}/${randomInInterval(100, 200, 0)}`,
            () => {
              client.publish(
                `${MAIN_TOPIC}/temperature`,
                `${id}/${moduleId}/${sensorId}/${randomInInterval(22, 25, 1)}`,
                () => {
                  client.publish(
                    `${MAIN_TOPIC}/turbidity`,
                    `${id}/${moduleId}/${sensorId}/${randomInInterval(
                      10,
                      30,
                      0
                    )}`
                  )
                }
              )
            }
          )
        }
      )
    })
  })
}

export { updateData }
