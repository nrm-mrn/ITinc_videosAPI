import { req } from './test-helpers'
import { db, setDB } from '../src/db/db'
// import {dataset1} from './datasets'
import { SETTINGS } from '../src/settings/settings'
import { CreateVideoInputModel, UpdateVideoInputModel } from '../src/videos/videosRouter'
import { Resolutions } from '../src/db/video-db-type'

describe('/videos', () => {
  beforeAll(async () => { // очистка базы данных перед началом тестирования
    setDB()
  })

  it('should get empty array', async () => {
    // setDB() // очистка базы данных если нужно

    const res = await req
      .get(SETTINGS.PATH.VIDEOS)
      .expect(200) // проверяем наличие эндпоинта

    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(0) // проверяем ответ эндпоинта

  })
  it('should get 400 error', async () => {
    const testData = {
      cases: [
        { title: '', author: 'auth', availableResolutions: ['P360'] },
        { title: 'testTitle', author: 'authorinvalidmorethantwenty', availableResolutions: ['P1080'] },
        { title: 'testTitle', author: 'auth', availableResolutions: 'P250' },
      ],
      expected: [
        { message: 'title is incorrect', field: 'title' }, { message: 'author is incorrect', field: 'author' }, { message: 'resolutions are incorrect', field: 'availableResolutions' }
      ]
    }
    for (const [i, el] of testData.cases.entries()) {
      const res = await req
        .post(SETTINGS.PATH.VIDEOS)
        .send(el)
        .expect(400)
      expect(res.body.errorMessages[0].message).toBe(testData.expected[i].message)
      expect(res.body.errorMessages[0].field).toBe(testData.expected[i].field)
    }
  })

  it('should create videos', async () => {
    const testData = {
      cases: [
        { title: 'first', author: 'author1', availableResolutions: ['P144', 'P1080'] },
        { title: 'second', author: 'auth2', availableResolutions: ['P2160'] },
        { title: 'third', author: 'Jack Sparrow', availableResolutions: ['P144', 'P720', 'P1080'] },
      ],
      expected: [
        { title: 'first', author: 'author1', availableResolutions: ['P144', 'P1080'], canBeDownloaded: true, minAgeRestriction: null },
        { title: 'second', author: 'auth2', availableResolutions: ['P2160'], canBeDownloaded: true, minAgeRestriction: null },
        { title: 'third', author: 'Jack Sparrow', availableResolutions: ['P144', 'P720', 'P1080'], canBeDownloaded: true, minAgeRestriction: null },
      ]
    }
    for (const [i, el] of testData.cases.entries()) {
      const res = await req
        .post(SETTINGS.PATH.VIDEOS)
        .send(el)
        .expect(201)
      expect(res.body.id).toEqual(expect.any(Number))
      const pubDate = new Date(res.body.publicationDate)
      const createdDate = new Date(res.body.createdAt)
      const diff = (pubDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      expect(diff).toBe(1)
      expect(res.body.author).toEqual(testData.expected[i].author)
      expect(res.body.availableResolutions).toEqual(testData.expected[i].availableResolutions)
      expect(res.body.canBeDownloaded).toEqual(testData.expected[i].canBeDownloaded)
      expect(res.body.minAgeRestriction).toEqual(testData.expected[i].minAgeRestriction)
    }
  })

  it('should create a video and get it by id', async () => {
    const vid: CreateVideoInputModel = { title: 'putvid', author: 'Nik', availableResolutions: [Resolutions.P1440] }
    const res = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(vid)
      .expect(201)
    const targetId = res.body.id

    const res2 = await req
      .get(SETTINGS.PATH.VIDEOS + `/${targetId}`)
      .expect(200)
    const newVid = res2.body
    expect(newVid.title).toEqual(vid.title)
    expect(newVid.author).toEqual(vid.author)

    await req
      .get(SETTINGS.PATH.VIDEOS + `42134`)
      .expect(404)
  })

  it('should create and update a video', async () => {
    const vid: CreateVideoInputModel = { title: 'updvid', author: 'Nik', availableResolutions: [Resolutions.P144] }
    const res = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(vid)
      .expect(201)
    const targetId = res.body.id

    const date = new Date().toISOString()
    const updateObj: UpdateVideoInputModel = {
      title: 'updated',
      author: 'Nik',
      availableResolutions: [Resolutions.P240],
      canBeDownloaded: true,
      minAgeRestriction: null,
      publicationDate: date,
    }

    await req
      .put(SETTINGS.PATH.VIDEOS + `/${targetId}`)
      .send(updateObj)
      .expect(204)

    const updatedVid = db.videos.filter(v => v.id === targetId)[0];
    expect(updatedVid.title).toEqual(updateObj.title)
    expect(updatedVid.author).toEqual(updateObj.author)
    expect(updatedVid.availableResolutions[0]).toEqual(updateObj.availableResolutions[0])
    expect(updatedVid.canBeDownloaded).toEqual(updateObj.canBeDownloaded)
    expect(updatedVid.minAgeRestriction).toEqual(updateObj.minAgeRestriction)
    expect(updatedVid.publicationDate).toEqual(updateObj.publicationDate)
  })
})
