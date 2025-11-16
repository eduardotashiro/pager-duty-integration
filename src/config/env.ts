import dotenv from "dotenv"
dotenv.config()

export const config = {
    slack:{
        botToken: process.env.SLACK_BOT_TOKEN!,
        signingSecret: process.env.SLACK_SIGNING_SECRET!,
    },
    PagerDuty: {
        url: process.env.PAGER_URL_CREATE!,
        token: process.env.ACCESS_TOKEN!,
        email:process.env.EMAIL!,
    },
    app:{
        urlThreadLink: process.env.URL_THREAD_LINK!,
        port: process.env.PORT || 3000,
    }
}

