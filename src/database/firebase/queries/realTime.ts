import { z } from 'zod'
import { Database } from 'firebase-admin/lib/database/database.js'
import debug from 'debug'

import { saveClientData } from 'database'
import { MAIN_TOPIC } from 'utils'

const realTimeDebug = debug(`${MAIN_TOPIC}:Mqtt:FirebaseRealTime`)
const clientData = z.object({
  date: z.string(),
  pH: z.number(),
  tds: z.number(),
  temperature: z.number(),
  turbidity: z.number(),
  demo: z.boolean().optional()
})

declare global {
  type ClientData = z.infer<typeof clientData>
}

type Update<T = number> = {
  db: Database
  id: string
  moduleId: string
  sensorId: string
  value: T
  demo?: boolean
}

const getData = async ({
  db,
  id,
  moduleId,
  sensorId
}: Omit<Update, 'value'>) => {
  const result = await db.ref(`/ids/${id}/${moduleId}/${sensorId}`).get()

  try {
    return clientData.parse(result.val())
  } catch {
    return null
  }
}

const updateDate = ({
  db,
  id,
  moduleId,
  sensorId,
  value,
  demo = false
}: Update<string>) => {
  if (demo)
    db.ref(`/ids/${id}/${moduleId}/${sensorId}/demo`).set(true, error => {
      if (error) realTimeDebug(`Error: ${error}`)
    })

  db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('Date updated.')
  })
}

const updatePH = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/pH`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('PH updated.')
  })
}

const updateTDS = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/tds`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('TDS updated.')
  })
}

const updateTemperature = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/temperature`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('Temperature updated.')
  })
}

const updateTurbidity = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/turbidity`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('Turbidity updated.')
  })
}

const listenChangesInDate = ({
  db,
  id,
  moduleId,
  sensorId
}: Omit<Update, 'value'>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).on('value', async () => {
    const data = await getData({ db, id, moduleId, sensorId })

    if (data && !data.demo) {
      try {
        await saveClientData(z.coerce.number().parse(sensorId), data)
      } catch (error) {
        realTimeDebug(`Error: ${error}`)
      }

      return
    }

    if (data && data.demo) {
      realTimeDebug(
        `The data for the sensor ${sensorId} was not saved because it is a demo.`
      )

      return
    }

    realTimeDebug(
      `Error: The data for the sensor ${sensorId} was not found in the database.`
    )
  })
}

export {
  updatePH,
  getData,
  updateTDS,
  updateTemperature,
  updateTurbidity,
  updateDate,
  listenChangesInDate
}
