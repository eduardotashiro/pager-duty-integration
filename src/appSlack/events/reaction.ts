import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { app } from "../../app";

type ReactionAddedEvent = SlackEventMiddlewareArgs<"reaction_added">["event"];

let incidentCount = 0;

async function searchOriginalMessage(client: any, channel: string, ts: string) {
  
  // Busca todas as mensagens da thread
  const result = await client.conversations.replies({ channel, ts });
  const allMessages = result.messages || [];

  // Identifica mensagem reagida e thread raiz
  const originalMessage = allMessages.find((m: any) => m.ts === ts);
  const threadOrigin = allMessages[0]?.thread_ts || allMessages[0]?.ts;
  
  let text = originalMessage.text || threadOrigin.text || "";

  // Substitui menções <@U123> por nomes reais
  const mention = /<@([A-Z0-9]+)>/g;             // Regex com grupo de captura
  const matches = [...text.matchAll(mention)];  // Converte iterador em array

  for (const match of matches) {
    const userId = match[1];                                      // Só o ID (sem <>@)
    const userInfo = await client.users.info({ user: userId });
    const realName = userInfo.user.profile.real_name;
    text = text.replace(match[0], realName);                   // match[0] = texto completo
  }
  
  return { originalMessage, threadOrigin, text };
}


app.event("reaction_added", async ({ event, client }) => {
  const e = event as ReactionAddedEvent;

  console.log("Usuário:", e.user);
  console.log("Emoji:", e.reaction);
  console.log("Mensagem:", e.item);
  console.log("Canal:", e.item.channel)

  if (e.reaction !== "hankey") return;
  incidentCount++; //quando tiver hometab

  try {

   // const result = await searchOriginalMessage(client,e.item.channel,e.item.ts)

    
    const { originalMessage, threadOrigin, text } = await searchOriginalMessage(
      client,
      e.item.channel,
      e.item.ts
    );
    


    await client.chat.postMessage({
      channel: e.item.channel,
      thread_ts: e.item.ts,

      text: "Criando Incidente",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Clique no botão abaixo para iniciar a abertura do incidente no :pagerduty:ager Duty.", //:pagerduty-seeklogo: - dev  | :pagerduty: - firma
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "📋 Criar Incidente" },
              action_id: "cria_incidente_btn",
              style: "primary", //danger ?
              value: JSON.stringify({      //temos que passar para string, pois vem como obj
                ts: originalMessage.ts,    //  TIMESTAMP DA MENSAGEM ESPECÍFICA!!!
                thread_ts: threadOrigin,  //   THREAD RAIZ !!!!
                messageAuthorId: originalMessage.user,
                text // msg que foi reagida
              }),
            },
          ],
        },
      ],
    });

    console.log("primeira msg do bot enviada com sucesso!");

  } catch (error) {

    console.error("Erro ao enviar a primeira msg do bot:", error);
  }
});

