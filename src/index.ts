import dotenv from "dotenv"
dotenv.config()

import { App, SlackEventMiddlewareArgs } from "@slack/bolt"
import { createModal } from "./modal"

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});


type ReactionAddedEvent = SlackEventMiddlewareArgs<"reaction_added">["event"]


let ticketCount = 0;

//inicia reação
app.event("reaction_added", async ({ event, client }) => {
  const e = event as ReactionAddedEvent;

  console.log("REACTION ADDED!")
  console.log("Usuário:", e.user)
  console.log("Emoji:", e.reaction)
  console.log("Mensagem:", e.item)

  if (e.reaction !== "hankey") return;
  ticketCount++;
  try {
    await client.chat.postMessage({
      channel: e.item.channel,
      text: `Você reagiu com :${e.reaction}: clique no botão para criar um incidente`,
      thread_ts: e.item.ts,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Clique aqui para criar o incidente",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Abrir Ticket" },
              action_id: "cria_incidente_btn",
            },
          ],
        },
      ],
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
  }
});

// btn pro modal, 
app.action("cria_incidente_btn", async ({ ack, body, client }) => {
  await ack();

  
  const triggerId = (body as any).trigger_id;

  if (!triggerId) return

  await client.views.open({
    trigger_id: triggerId,
    view: createModal(),
  });
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
