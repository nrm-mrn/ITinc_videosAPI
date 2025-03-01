import express from 'express'
import { videosRouter } from './videos/videosRouter'


export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' })
})

