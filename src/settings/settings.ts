import { config } from "dotenv";

config()

export const SETTINGS = {
  PORT: process.env.PORT || 5000,
  PATH: {
    VIDEOS: '/videos'
  }
}
