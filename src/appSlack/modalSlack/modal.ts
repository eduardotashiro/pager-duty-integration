import { app } from "../../app";
import { ModalView } from "@slack/types";
import { createIncident } from "../../appPagerDuty/createIncident/createIncident";
import dotenv from "dotenv";
dotenv.config();


export function createModal(channel: string, ts: string,  thread_ts: string,text: string,messageAuthorId: string, placeholderTs: string, ): ModalView {
  return {
    type: "modal",
    callback_id: "incidente_modal",
    private_metadata: JSON.stringify({ channel, ts ,thread_ts, messageAuthorId, placeholderTs}),
    title: { type: "plain_text", text: "Tuna Incidentes" },
    submit: { type: "plain_text", text: "Enviar" },
    close: { type: "plain_text", text: "Cancelar" },
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Criação de Incidentes",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "titulo",
        label: { type: "plain_text", text: "Título" },
        element: { type: "plain_text_input", action_id: "assunto_input" },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "servico",
        label: { type: "plain_text", text: "Serviço" },
        element: {
          type: "static_select",
          action_id: "servico_input",
          options: [
            {
              text: { type: "plain_text", text: "Anota Aí" },
              value: "P9Q80RE",
            },
            {
              text: { type: "plain_text", text: "Console API" },
              value: "PSKOIES",
            },
            {
              text: { type: "plain_text", text: "Console Web" },
              value: "PJAHA64",
            },
            {
              text: { type: "plain_text", text: "Engine API" },
              value: "P5TGWBC",
            },
            {
              text: { type: "plain_text", text: "Notifications" },
              value: "P8RZRP0",
            },
            {
              text: { type: "plain_text", text: "Token API" },
              value: "PCGAOFE",
            },
          ],
        },
      },
      {
        type: "input",
        block_id: "prioridade",
        label: { type: "plain_text", text: "Urgência" },
        element: {
          type: "radio_buttons",
          action_id: "prioridade_input",
          options: [
            {
              text: { type: "plain_text", text: "Baixa" },
              value: "low",
            },
            {
              text: { type: "plain_text", text: "Alta" },
              value: "high",
            },
          ],
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        block_id: "descricao",
        label: { type: "plain_text", text: "Descrição do incidente" },
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: "descricao_input",
          initial_value: text
        },
      },
    ],
  };
}



//submit
app.view("incidente_modal", async ({ ack, view, client }:{body:any,ack:any,view:any,client:any}) => {
  await ack()


  const titulo = view.state.values.titulo.assunto_input?.value ?? ""
  const servico =view.state.values.servico.servico_input.selected_option?.value ?? ""
  const urgencia =view.state.values.prioridade.prioridade_input.selected_option?.value ?? ""
  const descricao = view.state.values.descricao.descricao_input?.value ?? ""
 
  console.log(`titulo:    ${titulo}`   )
  console.log(`service:   ${servico}`  )
  console.log(`descrição: ${descricao}`)
  console.log(`urgencia:  ${urgencia}` )


  
  const metadata = JSON.parse(view.private_metadata);
  const channel = metadata.channel;
  const ts = metadata.ts;                 //  Mensagem específica que foi reagida
  const thread_ts = metadata.thread_ts;  //   Thread raiz (se existir)
  const messageAuthorId = metadata.messageAuthorId;
  const placeholderTs = metadata.placeholderTs;
  //const botMessageTs = metadata.botMessageTs;



 const incident = await createIncident({  //pegar quem resolver futuramente incident.last_status_change_by ?
  titulo:titulo,
  servico:{
    id:servico,
    type:"service_reference"
  },
  descricao:descricao,
  urgencia:urgencia,
  channel,
  ts: ts,               //  msg específica
  thread_ts: thread_ts //  Thread raiz
 })
 
 

await client.chat.update({
  channel: channel,
  ts: placeholderTs,
    text: `Incidente criado com sucesso para <@${messageAuthorId}>!`,
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Incidente Criado com Sucesso no :pagerduty-seeklogo:ager Duty !",
        emoji: true
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${messageAuthorId}> sua solicitação foi registrada e nossa equipe técnica foi notificada.`
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Título:* ${titulo}`
        }
    
      ]
    },
    {
      type: "section", 
      fields: [
        {
          type: "mrkdwn",
          text: `*Prioridade:* ${urgencia === 'high' ? 'Alta' : 'Baixa'}`
        },
        {
          type: "mrkdwn",
          text: `*Status:* Em andamento`
        }
      ]
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `${new Date().toLocaleString('pt-BR')} | TUNA :cactus:`
        }
      ]
    }
  ]
});
})
