import { app } from "../../app";
import { createModal } from "../modalSlack/modal";
import { BlockButtonAction} from "@slack/bolt"


// btn pro modal,

app.action("cria_incidente_btn", async ({ ack, body, client }) => {
  await ack();

//console.log("teste", JSON.stringify(body, null, 2))

  const bodyType = body as BlockButtonAction


  const botMessageTs = bodyType.message?.ts;  
  const triggerId = bodyType.trigger_id;
  const channel = bodyType.channel!.id;
 


  // Pega o JSON que ta no value do btn
  const value = JSON.parse(bodyType.actions[0].value!);
  const v = value
  const ts = v.ts;
  const thread_ts = v.thread_ts;
  const messageAuthorId = v.messageAuthorId;
  const text = v.text || "";
    

 

  // abre modal 
  try {
    await client.views.open({
      trigger_id: triggerId,
      view: createModal(channel, ts, thread_ts, text, messageAuthorId, botMessageTs!  ),
    });
  } catch (error) {
    console.error("Erro ao abrir modal:", error); 
  }
});
