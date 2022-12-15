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

const updatePh = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/ph`).set(value)
}

const updateTDS = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/tds`).set(value)
}

const updateTemperature = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/temperature`).set(value)
}

const updateTurbidity = ({ db, id, projectId, value }: Update) => {
  db.ref(`/ids/${id}/${projectId}/data/turbidity`).set(value, error => {
    if (error) return console.error('Error on updatePh', error)

    updateDate({ db, id, projectId, value: new Date().toISOString() })
  })
}

export { updatePh, updateTDS, updateTemperature, updateTurbidity, updateDate }
