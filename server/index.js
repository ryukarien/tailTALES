import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { petsRouter } from './routes/pets.js'
import { petRecordsRouter } from './routes/petRecords.js'

const app = express()
const clientOrigin = process.env.CLIENT_ORIGIN || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')
if (!clientOrigin) throw new Error('Set CLIENT_ORIGIN to the frontend origin before starting the production API.')

app.use(cors({ origin: clientOrigin }))
app.use(express.json({ limit: '5mb' })) // generous enough for base64 photo uploads

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/pets', petsRouter)
app.use('/api/pets/:petId', petRecordsRouter)

app.listen(process.env.PORT || 4000, () => {
  console.log(`tailTALES API listening on ${process.env.PORT || 4000}`)
})