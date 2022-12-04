import debug from 'debug'
import { readFileSync } from 'fs'
import { join } from 'path'

import { getClient } from './network'

const pubDebug = debug('WaterQuality:Mqtt:demo:pub')

const client = getClient()

client.on('error', error => {
  pubDebug('Error: ', error)
})

const filePath = join(__dirname, '../basic_pub_sub_test.png')
const file = readFileSync(filePath)

client.publish('WaterQuality/image', file, () => {
  pubDebug('Message send')
})
