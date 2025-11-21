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

  console.log("REACTION ADDED!");
  console.log("Usuário:", e.user);
  console.log("Emoji:", e.reaction);
  console.log("Mensagem:", e.item);
  console.log("Canal:", e.item.channel)

  if (e.reaction !== "hankey") return
  incidentCount++; //quando tiver hometab

  try {
    
    const resultt = await searchOriginalMessage(client,e.item.channel,e.item.ts)
    const originalMessage = resultt.originalMessage  // msg reagida
    const threadOrigin = resultt.threadOrigin       // thread raiz
    const cleanTextnoMention = resultt.text

    // criando a msg sem o value
    const botMessage = await client.chat.postMessage({
      channel: e.item.channel,
      thread_ts: e.item.ts,
      text: "Criar incidente. . . ",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `.`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: " Criar Incidente" },
              action_id: "cria_incidente_btn",
              value: "temp", // Valor temporário, que loucura, 3 horas tentando pegar o ts, mas só existe depois de enviar a msg KKKKKK
              style: "primary",
            },
          ],
        },
      ],
    });

    console.log("msg do bot enviada com TS:", botMessage.ts);

    
    await client.chat.update({
      channel: e.item.channel,
      ts: botMessage.ts!,  //atualizando a msg com o value certo, tive que enviar e atualizar, para pegar o ts, n tem como enviar o ts no value, ela só existe dps de enviar a msg 
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Clique no botão abaixo para iniciar a abertura do incidente no :pagerduty:ager Duty.`, //:pagerduty-seeklogo: - dev  | :pagerduty: - firma
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "📋 Criar Incidente" },
              action_id: "cria_incidente_btn",
              value: JSON.stringify({
                ts: originalMessage.ts,   //  TIMESTAMP DA MENSAGEM ESPECÍFICA!!!
                thread_ts: threadOrigin, //   THREAD RAIZ !!!!
                messageAuthorId: originalMessage.user,
                placeholderTs: botMessage.ts,
                text: cleanTextnoMention,
              }),
              style: "primary", //danger ?
            },
          ],
        },
      ],
    });

    console.log("Mensagem do bot atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
});
