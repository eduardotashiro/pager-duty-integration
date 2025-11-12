import { SlackEventMiddlewareArgs } from "@slack/bolt";
import { app } from "../../app";

type ReactionAddedEvent = SlackEventMiddlewareArgs<"reaction_added">["event"];

let incidentCount = 0;

async function searchOriginalMessage(client: any, channel: string, ts: string) {
  // Bpega toda a thread
  const result = await client.conversations.replies({
    channel: channel,
    ts: ts,
  });

  const allMessages = result.messages || [];

  const originalMessage = allMessages.find((m:any) => m.ts === ts);      // msg reagida
  const threadOrigin = allMessages[0]?.thread_ts || allMessages[0]?.ts; // thread raiz

  return { originalMessage, threadOrigin };
}



app.event("reaction_added", async ({ event, client }) => {
  const e = event as ReactionAddedEvent;

  console.log("REACTION ADDED!");
  console.log("Usuário:", e.user);
  console.log("Emoji:", e.reaction);
  console.log("Mensagem:", e.item);

  if (e.reaction !== "hankey") return;
  incidentCount++; //quando tiver hometab

  try {
    
    const resultt = await searchOriginalMessage(client,e.item.channel,e.item.ts)
    const originalMessage = resultt.originalMessage  // msg reagida
    const threadOrigin = resultt.threadOrigin       // thread raiz

    // criando a msg sem o value
    const botMessage = await client.chat.postMessage({
      channel: e.item.channel,
      thread_ts: e.item.ts,
      text: "Clique no botão para criar incidente",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: Olá! \n\nVamos criar um incidente no PagerDuty para essa mensagem. Clique no botão abaixo para começar.`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "📋 Criar Incidente" },
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
            text: `Vamos criar um incidente no PagerDuty para este caso.\n\nClique no botão abaixo para começar.`,
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
                text: originalMessage.text || "",
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
