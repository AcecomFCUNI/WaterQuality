import { Database } from 'firebase-admin/lib/database/database.js'

type Update<T = number> = {
  db: Database
  id: string
  projectId: string
  value: T
}

const updateDate = ({ db, id, projectId, value }: Update<string>) => {
  db.ref(`/ids/${id}/${projectId}/data/date`).set(value)
}

const updatePH = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/pH`).set(value)
}

const getData = ({ db, id, projectId }: Omit<Update, 'value'>) => {
  return db.ref(`/ids/${id}/${projectId}/data`).get()
}

const updateTDS = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/tds`).set(value)
}

const updateTemperature = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/temperature`).set(value)
}

const updateTurbidity = ({
  db,
  id,
  projectId,
  value,
  date
}: Update & { date: Date }) => {
  db.ref(`/ids/${id}/${projectId}/data/turbidity`).set(value, error => {
    if (error) return console.error('Error on updatePH', error)

    updateDate({ db, id, projectId, value: date.toISOString() })
  })
}

export {
  updatePH,
  getData,
  updateTDS,
  updateTemperature,
  updateTurbidity,
  updateDate
}
