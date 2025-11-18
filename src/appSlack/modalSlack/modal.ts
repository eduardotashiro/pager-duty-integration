import { app } from "../../app";
import { ModalView } from "@slack/types";
import { createIncident } from "../../appPagerDuty/createIncident/createIncident";
import { saveMessageReference } from "../storage/messageStorage";

export function createModal(
  channel: string,
  ts: string,
  thread_ts: string,
  text: string,
  messageAuthorId: string,
  placeholderTs: string
): ModalView {

interface ServiceOption {
  text: { type: "plain_text"; text: string };
  value: string;
}

const allServices: ServiceOption[] = [
  {
    text: { type: "plain_text", text: " Alertas gerais" }, //Anota Aí
    value: "P9Q80RE",
  },
  {
    text: { type: "plain_text", text: " API Interna" },    //Console API
    value: "PSKOIES",
  },
  {
    text: { type: "plain_text", text: "Painel Web" },     //Console Web
    value: "PJAHA64",
  },
  {
    text: { type: "plain_text", text: " Processamento" },  //Engine API
    value: "P5TGWBC",
  },
  {
    text: { type: "plain_text", text: "Notifications" },     //Notifications
    value: "P8RZRP0",
  },
  {
    text: { type: "plain_text", text: " Tokenização" },    //Token API
    value: "PCGAOFE",
  }
];

 
  let servicesToShow;

   switch(channel) {
    case "C03KR86CDGX": //C09E8US58TS
      servicesToShow = allServices;
      break;
      
    // case "C4C4C4C4": 
    //   servicesToShow = allServices.filter(service => service.value !== "P8RZRP0");
    //   break;

    // case "C4C4C4C4": 
    //   servicesToShow = allServices.filter(service => 
    //     service.value === "P9Q80RE" || // Alertas gerais
    //     service.value === "P5TGWBC"    // Processamento
    //   );
    //   break;

    // case "C4C4C4C4": 
    //   servicesToShow = allServices.filter(service => 
    //     service.value === "PSKOIES" || // API Interna
    //     service.value === "PCGAOFE"    // Tokenização
    //   );
    //   break;
      
    default:
      servicesToShow = allServices.filter(service => service.value !== "P9Q80RE"); //&& service.value !== "P8RZRP0"
      break;
  }


  return {
    type: "modal",
    callback_id: "incidente_modal",
    private_metadata: JSON.stringify({
      channel,
      ts,
      thread_ts,
      messageAuthorId,
      placeholderTs,
    }),
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
          options:servicesToShow,
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
          initial_value: text,
        },
      },
    ],
  };
}

//submit
app.view("incidente_modal",async ({ ack, view }: { body: any; ack: any; view: any; client: any }) => {
    await ack()

    const vsv = view.state.values;

    const titulo = vsv.titulo.assunto_input?.value ?? "";
    const servico = vsv.servico.servico_input.selected_option?.value ?? "";
    const urgencia =vsv.prioridade.prioridade_input.selected_option?.value ?? "";
    const descricao = vsv.descricao.descricao_input?.value ?? "";




    console.log("dados do incidente:", {
      titulo,
      servico,
      descricao,
      urgencia,
    });




    const metadata = JSON.parse(view.private_metadata);
    const channel = metadata.channel;
    const ts = metadata.ts;                //  msg específica
    const thread_ts = metadata.thread_ts; //  Thread raiz
    const messageAuthorId = metadata.messageAuthorId;
    const placeholderTs = metadata.placeholderTs;
                               



    const incident = await createIncident({
      titulo: titulo,
      servico: {
        id: servico,
        type: "service_reference",
      },
      descricao: descricao,
      urgencia: urgencia,
      channel,
      ts: ts,                //  msg específica
      thread_ts: thread_ts, //  Thread raiz
    });

    console.log(`Incidente criado: #${incident.incident_number} por ${messageAuthorId}`);
    console.log(`salvando`);

    saveMessageReference(
      incident.id,                  // ID do PagerDuty
      channel,                     // Canal do Slack
      placeholderTs,              // Timestamp da mensagem do bot
      messageAuthorId,           // Quem criou o incidente
      incident.incident_number // Número do incidente
    );

    console.log(`storage atualizado para incidente: ${incident.id}`);
    console.log(`referencia: ${channel} -> ${placeholderTs}`);
  }
);
