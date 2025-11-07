import {App, LogLevel} from "@slack/bolt"


import dotenv from "dotenv"
dotenv.config()

if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
    console.error(`Deu problema no ENV`)
}

 export const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET

})

