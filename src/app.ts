import express from 'express'
import { getVideosController } from './videos/getVideosController'
import { videosRouter } from './videos/videosRouter'


export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' })
})

app.get('/videos', getVideosController)
