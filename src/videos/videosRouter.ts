import { Request, Response, Router } from "express";
import { db } from "../db/db";
import { APIErrorResult } from "../shared/types";
import { Resolutions, VideoDBType } from "../db/video-db-type";


export type CreateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
}

export type UpdateVideoInputModel = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
}

export const videosRouter = Router({})


videosRouter.get('/', (req: Request, res: Response) => {
  const videos = db.videos
  res.status(200).send(videos)
})

videosRouter.post('/', (req: Request<any, any, CreateVideoInputModel>, res: Response) => {
  let errors: APIErrorResult = { errorMessages: [] }
  if (!req.body.title || req.body.title.length > 40) {
    errors.errorMessages.push({ message: 'title is incorrect', field: 'title' })
  }
  if (!req.body.author || req.body.author.length > 20) {
    errors.errorMessages.push({ message: 'author is incorrect', field: 'author' })
  }
  if (!Array.isArray(req.body.availableResolutions) || req.body.availableResolutions.find(r => !Resolutions[r])) {
    errors.errorMessages.push({ message: 'resolutions are incorrect', field: 'availableResolutions' })
  }
  if (errors.errorMessages.length) {
    res.status(400).json(errors)
    return
  }
  const now = new Date()
  const nextDay = new Date()
  nextDay.setDate(nextDay.getDate() + 1)
  const newVideo = {
    id: Date.now() + Math.random(),
    createdAt: now.toISOString(),
    publicationDate: nextDay.toISOString(),
    canBeDownloaded: true,
    minAgeRestriction: null,
    ...req.body
  }
  db.videos.push(newVideo)
  res.status(201).send(newVideo)
})

videosRouter.get('/:id', (req: Request<{ id: string }>, res: Response<VideoDBType>) => {
  const targetId = +req.params.id
  const vid = db.videos.filter(v => v.id === targetId)
  if (!vid.length) {
    res.sendStatus(404)
  }

  res.status(200).send(vid[0])
})

videosRouter.put('/:id', (req: Request<{ id: string }, any, UpdateVideoInputModel>, res: Response) => {
  const targetId = +req.params.id
  let vid = db.videos.find(v => v.id === targetId)
  if (!vid) {
    res.sendStatus(404)
    return
  }
  const update = req.body
  const errors: APIErrorResult = { errorMessages: [] }
  if (!update.title || update.title.length > 40) {
    errors.errorMessages.push({ message: 'wrong title', field: 'title' })
  }
  if (!update.author || update.author.length > 20) {
    errors.errorMessages.push({ message: 'wrong author', field: 'author' })
  }
  if (!Array.isArray(update.availableResolutions) || update.availableResolutions.find(r => !Resolutions[r])) {
    errors.errorMessages.push({ message: 'wrong res', field: 'availableResolutions' })
  }
  if (typeof (update.canBeDownloaded) !== "boolean") {
    errors.errorMessages.push({ message: 'wrong can be downloaded', field: 'canBeDownloaded' })
  }
  if (update.minAgeRestriction && (update.minAgeRestriction < 1 || update.minAgeRestriction > 18)) {
    errors.errorMessages.push({ message: 'Wrong age restriction', field: 'minAgeRestriction' })
  }
  if (!update.publicationDate) {
    errors.errorMessages.push({ message: 'Publication date', field: 'publicationDate' })
  }
  if (errors.errorMessages.length) {
    res.status(400).send(errors);
    return;
  }
  vid = { ...vid, ...update }
  const idx = db.videos.findIndex(v => v.id === targetId)
  db.videos[idx] = vid
  res.sendStatus(204)
})

videosRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const targetId = +req.params.id
  const idx = db.videos.findIndex(v => v.id === targetId)
  console.log(`found ${targetId}  at ${idx}`)
  if (idx < 0) {
    res.sendStatus(404)
    return
  }
  db.videos.splice(idx, 1)
  res.sendStatus(204)
})
