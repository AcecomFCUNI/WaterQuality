import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const clients = [
  {
    id: '95008c5b-db0f-442f-99c0-4dc06562a91a',
    moduleId: 1,
    sensorId: 1
  }
]

const randomInInterval = (min: number, max: number, fix = 2): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

const waitFor = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

type ClientPublishProps<T> = {
  client: MqttClient
  value: T
  id: string
  moduleId: number
  sensorId: number
  topic: string
  cb?: () => void
}

const clientPublish = <T>({
  client,
  value,
  id,
  moduleId,
  sensorId,
  topic,
  cb
}: ClientPublishProps<T>) => {
  client.publish(
    `${MAIN_TOPIC}/${topic}`,
    `${id}/${moduleId}/${sensorId}/${value}`
  )
  cb?.()
}

const updateData = (client: MqttClient) => {
  const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:pub`)

  cron.schedule('*/10 * * * * *', async (): Promise<void> => {
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    for (const { id, moduleId, sensorId } of clients) {
      const currentIsoTime = new Date().toISOString()

      pubDebug(`Publishing messages at: ${currentIsoTime}`)
      clientPublish({
        client,
        value: randomInInterval(6.5, 7.5, 1),
        id,
        moduleId,
        sensorId,
        topic: 'pH',
        cb: () => {
          clientPublish({
            client,
            value: randomInInterval(100, 200, 0),
            id,
            moduleId,
            sensorId,
            topic: 'tds',
            cb: () => {
              clientPublish({
                client,
                value: randomInInterval(22, 25, 1),
                id,
                moduleId,
                sensorId,
                topic: 'temperature',
                cb: () => {
                  clientPublish({
                    client,
                    value: randomInInterval(10, 30, 0),
                    id,
                    moduleId,
                    sensorId,
                    topic: 'turbidity',
                    cb: () => {
                      clientPublish({
                        client,
                        value: currentIsoTime,
                        id,
                        moduleId,
                        sensorId,
                        topic: 'date'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
    await waitFor(1000)
  })
}

export { updateData }
