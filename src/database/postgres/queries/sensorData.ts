import debug from 'debug'

import { MAIN_TOPIC } from 'utils'
import { dbConnection } from '../connection'

const postgresDebug = debug(`${MAIN_TOPIC}:Mqtt:PostgreSQL`)

const saveClientData = async (sensorId: number, clientData: ClientData) => {
  const client = await dbConnection().connect()
  const { date: createdAt, ...data } = clientData

  await client.sensorData.create({
    data: {
      ...data,
      createdAt: new Date(createdAt),
      sensorId
    }
  })
  postgresDebug('Data saved.')
}

export { saveClientData }
