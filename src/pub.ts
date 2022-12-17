import debug from 'debug'
import { getClient } from './network/mqtt'

const pubDebug = debug('WaterQuality:Mqtt:demo:pub')
const client = getClient()

client.on('error', error => {
  pubDebug('Error: ', error)
})

client.publish('WaterQuality/electricConductivity', 'wea', () => {
  pubDebug('Message send')
})
