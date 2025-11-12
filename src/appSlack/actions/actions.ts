import { createModal } from "../modalSlack/modal";
import { app } from "../../app";

// btn pro modal,
app.action("cria_incidente_btn", async ({ ack, body, client }) => {
  await ack();

  const triggerId = (body as any).trigger_id;
  const channel = (body as any).channel.id;
 
  // Pega o JSON que enviamos no value do botão
  const value = JSON.parse((body as any).actions?.[0]?.value);
  const ts = value.ts;
  const thread_ts = value.thread_ts;
  const messageAuthorId = value.messageAuthorId;
  const placeholderTs = value.placeholderTs;
  const text = value.text || "";

  // abre modal com os parametos do modal.ts
  try {
    await client.views.open({
      trigger_id: triggerId,
      view: createModal(channel, ts, thread_ts, text, messageAuthorId, placeholderTs),
    });
  } catch (error) {
    console.error("Erro ao abrir modal:", error); //não vai ter mas nao custa nada né 
  }
});

