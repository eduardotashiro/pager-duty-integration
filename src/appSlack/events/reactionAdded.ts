
import { SlackEventMiddlewareArgs } from "@slack/bolt"
import { createModal } from "../modalSlack/modal";
import  {app}  from "../index";



/*export interface AppMentionEvent {
    type: 'app_mention';
    subtype?: string;
    bot_id?: string;
    bot_profile?: BotProfile;
    username?: string;
    team?: string;
    user_team?: string;
    source_team?: string;
    user_profile?: {
        name: string;
        first_name: string;
        real_name: string;
        display_name: string;
        team: string;
        is_restricted?: boolean;
        is_ultra_restricted?: boolean;
        avatar_hash?: string;
        image_72?: string;
    };
    user?: string;
    text: string;
    attachments?: MessageAttachment[];
    blocks?: (KnownBlock | Block)[];
    files?: {
        id: string;
    }[];
    upload?: boolean;
    display_as_bot?: boolean;
    edited?: {
        user: string;
        ts: string;
    };
    ts: string;
    channel: string;
    event_ts: string;
    thread_ts?: string;
    client_msg_id?: string;
}
    */

type ReactionAddedEvent = SlackEventMiddlewareArgs<"reaction_added">["event"]           //@slack/types


let ticketCount = 0;

async function registerEvents(app:any) {
    

app.event("reaction_added", async ({ event, client }) => {    //que tipo é isso ??
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
})}


/*@slack/types → descreve como o Slack te envia os dados.

Suas interfaces → descrevem como você organiza os seus próprios dados.*/