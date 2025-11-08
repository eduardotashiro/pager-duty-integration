import { app } from "../../app";
import { ModalView } from "@slack/types";

export function createModal(channel: string, ts: string): ModalView {
  //quem sabe nao daria boa por parametros para ter modais pré configurados tipo um serviceOptions p incidentes..
  return {
    type: "modal",
    callback_id: "incidente_modal",
    private_metadata: JSON.stringify({ channel, ts }), // contexto da thread
    title: { type: "plain_text", text: "Pager Duty Demo" },
    submit: { type: "plain_text", text: "Enviar" },
    close: { type: "plain_text", text: "Cancelar" },
    blocks: [
      {
        type: "input",
        block_id: "servico",
        label: { type: "plain_text", text: "Serviço" },
        element: {
          type: "static_select",
          action_id: "servico_input",
          option_groups: [
            {
              label: { type: "plain_text", text: "1 | " },
              options: [
                { text: { type: "plain_text", text: "e)" }, value: "1195946" },
                { text: { type: "plain_text", text: "d)" }, value: "1226508" },
                { text: { type: "plain_text", text: "u)" }, value: "1244237" },
                { text: { type: "plain_text", text: "a)" }, value: "1195992" },
                { text: { type: "plain_text", text: "r)" }, value: "1195993" },
                { text: { type: "plain_text", text: "d)" }, value: "1195995" },
                { text: { type: "plain_text", text: "o)" }, value: "1196029" },
                { text: { type: "plain_text", text: "$)" }, value: "1196022" },
                { text: { type: "plain_text", text: "t)" }, value: "1196051" },
                { text: { type: "plain_text", text: "a)" }, value: "1196053" },
                { text: { type: "plain_text", text: "s)" }, value: "1196048" },
                { text: { type: "plain_text", text: "h)" }, value: "1344608" },
                { text: { type: "plain_text", text: "i)" }, value: "1195994" },
                { text: { type: "plain_text", text: "r)" }, value: "1238553" },
                { text: { type: "plain_text", text: "o)" }, value: "1196055" },
              ],
            },
            {
              label: { type: "plain_text", text: "2 |" },
              options: [
                { text: { type: "plain_text", text: "a)" }, value: "1196095" },
                { text: { type: "plain_text", text: "b)" }, value: "1196113" },
                { text: { type: "plain_text", text: "c)" }, value: "1196152" },
                { text: { type: "plain_text", text: "d)" }, value: "1196153" },
                { text: { type: "plain_text", text: "e)" }, value: "1196154" },
                { text: { type: "plain_text", text: "f)" }, value: "1196155" },
              ],
            },
            {
              label: { type: "plain_text", text: "3 |" },
              options: [
                { text: { type: "plain_text", text: "a)" }, value: "1196200" },
                { text: { type: "plain_text", text: "b)" }, value: "1196204" },
                { text: { type: "plain_text", text: "c)" }, value: "1196211" },
                { text: { type: "plain_text", text: "d)" }, value: "1196214" },
                { text: { type: "plain_text", text: "e)" }, value: "1196218" },
                { text: { type: "plain_text", text: "f)" }, value: "1196220" },
                { text: { type: "plain_text", text: "g)" }, value: "1196221" },
              ],
            },
            {
              label: { type: "plain_text", text: "4 |" },
              options: [
                { text: { type: "plain_text", text: "a)" }, value: "1196223" },
                { text: { type: "plain_text", text: "b)" }, value: "1196224" },
                { text: { type: "plain_text", text: "c)" }, value: "1196225" },
                { text: { type: "plain_text", text: "d)" }, value: "1196226" },
                { text: { type: "plain_text", text: "e)" }, value: "1196228" },
                { text: { type: "plain_text", text: "f)" }, value: "1196229" },
                { text: { type: "plain_text", text: "g)" }, value: "1196230" },
                { text: { type: "plain_text", text: "h)" }, value: "1196232" },
                { text: { type: "plain_text", text: "i)" }, value: "1196234" },
                { text: { type: "plain_text", text: "j)" }, value: "1199383" },
                { text: { type: "plain_text", text: "k"  }, value: "1225228" },
                { text: { type: "plain_text", text: "l)" }, value: "1225896" },
                { text: { type: "plain_text", text: "m)" }, value: "1234468" },
                { text: { type: "plain_text", text: "n)" }, value: "1314886" },
              ],
            },
          ],
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "assunto",
        label: { type: "plain_text", text: "Assunto do Incidente" }, //teste
        element: { type: "plain_text_input", action_id: "assunto_input" },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "descricao", //teste hard code
        label: { type: "plain_text", text: "Descrição do incidente" },
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: "descricao_input",
        },
      },
    ],
  };
}

//submit

app.view("incidente_modal", async ({ ack, body, view, client }) => {
  await ack();

  const user = body.user.id;

  // contexto original da thread
  const metadata = JSON.parse(view.private_metadata);
  const channel = metadata.channel;
  const ts = metadata.ts;

  //dados do modal
  const servico =view.state.values.servico.servico_input.selected_option?.text.text;
  const assunto = view.state.values.assunto.assunto_input.value;
  const descricao = view.state.values.descricao.descricao_input.value;

  //pagerduty aqui ?

  await client.chat.update({
    channel,
    ts,
    text: `Incidente criado com sucesso !\n\n*Serviço:* ${servico}\n*Assunto:* ${assunto}\n*Descrição:* ${descricao}`,
    blocks: [], //
  });

  await client.chat.postMessage({
    channel,
    thread_ts: ts,
    text: `salve <@${user}> seu incidente foi registrado com sucesso no PagerDuty!`,
  });
});
