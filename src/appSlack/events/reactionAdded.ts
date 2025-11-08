
import { SlackEventMiddlewareArgs } from "@slack/bolt"
import { app } from "../../app";

type ReactionAddedEvent = SlackEventMiddlewareArgs<"reaction_added">["event"]   

let ticketCount = 0;


    
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
              text: { type: "plain_text", text: "Criar Incidente" },
              action_id: "cria_incidente_btn",
            },
          ],
        },
      ],

      
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
  }
})


