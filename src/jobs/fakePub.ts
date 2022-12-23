import { CronJob } from 'cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

const randomInInterval = (min: number, max: number, fix = 2): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

const updateData = (client: MqttClient) => {
  return new CronJob('*/15 * * * * *', async (): Promise<void> => {
    const pubDebug = debug('WaterQuality:Mqtt:demo:pub')
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    client.on('error', error => {
      pubDebug('Error: ', error)
    })

    client.publish(
      'WaterQuality/pH',
      `jhon/Chuzcarry/${randomInInterval(6.5, 7.5, 1)}`,
      () => {
        client.publish(
          'WaterQuality/totalDissolvedSolids',
          `jhon/Chuzcarry/${randomInInterval(100, 200, 0)}`,
          () => {
            client.publish(
              `WaterQuality/temperature`,
              `jhon/Chuzcarry/${randomInInterval(22, 25, 1)}`,
              () => {
                client.publish(
                  'WaterQuality/turbidity',
                  `jhon/Chuzcarry/${randomInInterval(10, 30, 0)}`
                )
              }
            )
          }
        )
      }
    )
  })
}

export { updateData }
