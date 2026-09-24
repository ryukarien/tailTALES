import express from 'express'
import cors from 'cors'
import { petsRouter } from './routes/pets.js'
import { petRecordsRouter } from './routes/petRecords.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }))
app.use(express.json({ limit: '5mb' })) // generous enough for base64 photo uploads

app.use('/api/pets', petsRouter)
app.use('/api/pets/:petId', petRecordsRouter)

app.listen(process.env.PORT || 4000, () => {
  console.log(`tailTALES API listening on ${process.env.PORT || 4000}`)
})