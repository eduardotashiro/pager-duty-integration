import dotenv from "dotenv"
dotenv.config()

import { App } from "@slack/bolt"

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});


app.event("app_home_opened", async ({ event, client }) => {
   try {
  await client.views.publish({
  user_id: event.user,
  view: {
    type: "home",
    blocks: [
      
      {
        type: "image",
        image_url: "https://i.ibb.co/0p5Bknct/Tuna-suporte-6.png", 
        alt_text: "Banner principal",
      },
      
      {
        type: "header",
        text: {
          type: "plain_text",
          text:  `:tuna-bot: Total de Tickets criados: 780 `, //${ticketCount}
          emoji: true,
        },
      },
      
      {
        type: "divider",
      },
    ],
  },
});
  } catch (err) {
    console.error("Erro ao atualizar Home Tab:", err);
  }
});



(async () => {
  await app.start(process.env.PORT || 4000)
  console.log(`⚡️ App is running on port ${process.env.PORT || 4000}`)
})()
