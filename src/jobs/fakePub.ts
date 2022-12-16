import { CronJob } from 'cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

const updateData = (client: MqttClient) => {
  return new CronJob('*/15 * * * * *', async (): Promise<void> => {
    const pubDebug = debug('WaterQuality:Mqtt:demo:pub')
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    client.on('error', error => {
      pubDebug('Error: ', error)
    })

    client.publish('WaterQuality/pH', `jhon/Chuzcarry/${Math.random()}`, () => {
      client.publish(
        'WaterQuality/totalDissolvedSolids',
        `jhon/Chuzcarry/${Math.random()}`,
        () => {
          client.publish(
            `WaterQuality/temperature`,
            `jhon/Chuzcarry/${Math.random()}`,
            () => {
              client.publish(
                'WaterQuality/turbidity',
                `jhon/Chuzcarry/${Math.random()}`
              )
            }
          )
        }
      )
    })
  })
}

export { updateData }
