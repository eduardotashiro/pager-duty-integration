import { createModal } from "../modalSlack/modal";
import { app } from "../../app";
import { BlockButtonAction} from "@slack/bolt"


// btn pro modal,
app.action("cria_incidente_btn", async ({ ack, body, client }) => {
  await ack();

  const bodyType = body as BlockButtonAction

  const triggerId = bodyType.trigger_id;
  const channel = bodyType.channel!.id;
 
  // Pega o JSON que enviamos no value do botão
  const value = JSON.parse(bodyType.actions[0].value!);
  const v = value
  const ts = v.ts;
  const thread_ts = v.thread_ts;
  const messageAuthorId = v.messageAuthorId;
  const placeholderTs = v.placeholderTs;
  const text = v.text || "";

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

