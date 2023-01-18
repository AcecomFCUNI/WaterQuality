import { Database } from 'firebase-admin/lib/database/database.js'

type Update<T = number> = {
  db: Database
  id: string
  moduleId: string
  sensorId: string
  value: T
}

const getData = ({ db, id, moduleId, sensorId }: Omit<Update, 'value'>) => {
  return db.ref(`/ids/${id}/${moduleId}/${sensorId}`).get()
}

const updateDate = ({ db, id, moduleId, sensorId, value }: Update<string>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).set(value)
}

const updatePH = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/pH`).set(value)
}

const updateTDS = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/tds`).set(value)
}

const updateTemperature = ({ db, id, moduleId, sensorId, value }: Update) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/temperature`).set(value)
}

const updateTurbidity = ({
  db,
  id,
  moduleId,
  sensorId,
  value,
  date
}: Update & { date: Date }) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/turbidity`).set(value, error => {
    if (error) return console.error('Error on update turbidity', error)

    updateDate({ db, id, moduleId, sensorId, value: date.toISOString() })
  })
}

// TODO: modify this function to update the sensorData in the postgreSQL database
const listenChangesInDate = ({
  db,
  id,
  moduleId,
  sensorId
}: Omit<Update, 'value'>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).on(
    'value',
    async snapshot => {
      const data = await getData({ db, id, moduleId, sensorId })

      console.log('Date changed', data.val())
    }
  )
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
