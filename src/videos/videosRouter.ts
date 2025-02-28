import { Request, Response, Router } from "express";
import { db } from "../db/db";


export const videosRouter = Router({})


videosRouter.get('/', (req: Request, res: Response) => {
  const videos = db.videos
  res.status(200).send(videos)
})
