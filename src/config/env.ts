import dotenv from "dotenv"
dotenv.config()

export const config = {
    slack:{
        botToken: process.env.SLACK_BOT_TOKEN!,
        signingSecret: process.env.SLACK_SIGNING_SECRET!,
        clientID: process.env.SLACK_CLIENT_ID!,
        clientSecret:process.env.SLACK_CLIENT_SECRET!
    },
    PagerDuty: {
        url: process.env.PAGER_URL_CREATE!,
        token: process.env.ACCESS_TOKEN!,
        email:process.env.EMAIL!,
    },
    app:{
        urlThreadLink: process.env.URL_THREAD_LINK!,
        port: process.env.PORT || 3000,
    },
    redis:{
        redisUrl: process.env.REDIS_URL!
    },
    slackId:{
        Andrea:process.env.ANDREA!,
        Fernando:process.env.FERNANDO!,
        Guillermo:process.env.GUILLERMO!,
        Juan:process.env.JUAN!,
        Leandro:process.env.LEANDRO!,
        Matheus:process.env.MATHEUS!,
        Paul:process.env.PAUL!,
        Sergio:process.env.SERGIO!,
        Tamara:process.env.TAMARA!,
        Eduardo:process.env.EDUARDO!
    }
}