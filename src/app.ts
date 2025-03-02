import express, { Request, Response } from 'express'
import { videosRouter } from './videos/videosRouter'
import { setDB } from './db/db'


export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)

app.get('/', (req, res) => {
  res.status(200).json({ version: '1.0' })
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
  setDB();
  res.sendStatus(204);
})

