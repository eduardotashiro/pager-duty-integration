import { createModal } from "../modalSlack/modal";
import { app } from "../../app";

// btn pro modal,
app.action("cria_incidente_btn", async ({ ack, body, client }) => {
  await ack();

  const triggerId = (body as any).trigger_id;
  const channel = (body as any).channel?.id;
  const ts = (body as any).message?.ts;

  if (!triggerId || !channel || !ts) return;

  if (!triggerId) return;

  await client.views.open({
    trigger_id: triggerId,
    view: createModal(channel, ts),
  });
});
