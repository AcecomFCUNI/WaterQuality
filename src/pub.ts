import debug from 'debug'
import { getClient } from './network'

const pubDebug = debug('WaterQuality:Mqtt:demo:pub')
const client = getClient()

client.on('error', error => {
  pubDebug('Error: ', error)
})

client.publish('WaterQuality/electricConductivity', 'wea', () => {
  pubDebug('Message send')
})
