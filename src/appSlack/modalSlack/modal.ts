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
      text: { type: "plain_text", text: "Plataforma Anota Aí" }, //Anota Aí
      value: "P9Q80RE",
    },
    {
      text: { type: "plain_text", text: "Console Tuna API" }, //Console API
      value: "PSKOIES",
    },
    {
      text: { type: "plain_text", text: "Console Tuna" }, //Console Web
      value: "PJAHA64",
    },
    {
      text: { type: "plain_text", text: "Tuna Core API" }, //Engine API
      value: "P5TGWBC",
    },
    {
      text: { type: "plain_text", text: "Notificações" }, //Notifications
      value: "P8RZRP0",
    },
    {
      text: { type: "plain_text", text: "Tokenização" }, //Token API
      value: "PCGAOFE",
    },
  ];

  let servicesToShow;

  switch (channel) {
    case "C09E8US58TS": // C03KR86CDGX
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
      servicesToShow = allServices.filter(
        (service) => service.value !== "P9Q80RE"
      ); //&& service.value !== "P8RZRP0"
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
    title: { type: "plain_text", text: "Tuna Incidentes 🌵", emoji: true },
    submit: { type: "plain_text", text: "Enviar" },
    close: { type: "plain_text", text: "Cancelar" },
    blocks: [
      /* {
			type: "section",
			text: {
				type: "mrkdwn",
				text: "This is a section block with an accessory image."
			},
			accessory: {
				type: "image",
				image_url: "https://github.com/eduardotashiro/pager-duty-integration/blob/fdfd096777bb3d93c6bfdf01f2cc2446e5b2998d/src/image/pagerduty-seeklogo.png",
				alt_text: "cute cat"
			}
		},*/
      {
        type: "input",
        block_id: "titulo",
        label: { type: "plain_text", text: "Título" },
        element: {
          type: "plain_text_input",
          action_id: "assunto_input",
          placeholder: {
            type: "plain_text",
            text: "Digite um título...",
          },
        },
      },
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text:
              "*Serviços disponíveis*\n\n" +
              "•  *Plataforma Anota Aí* → Caso não encontre o serviço específico, utilize este.\n" + // OK
              "•  *Console Tuna API* → Back-end do Console, gerencia recursos e integrações.\n" +  //OK
              "•  *Console Tuna* → Interface web do Console.\n" +                                //OK
              "•  *Tuna Core API* → Processa transações e operações financeiras.\n" +          //OK
              "•  *Notificações* → Comunicação entre provedores e antifraude.\n" +           //OK
              "•  *Tokenização* → Armazenamento e tokenização de cartões de crédito.",     //OK
          },
        ],
      },
      {
        type: "input",
        block_id: "servico",
        label: { type: "plain_text", text: "Serviço" },
        element: {
          type: "static_select",
          action_id: "servico_input",
          options: servicesToShow,
        },
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
      /*
       *como ativar upload de arquivos no modal: (pager não suporta mas só a nível de curiosidade)
       *
       * Para permitir anexos nos modais do Slack, vai ser necessário:
       *
       * 1º No Manifest:
       *    "features": {
       *      "attachments": { "file_uploads_enabled": true }
       *    }
       *
       * 2º Scopes obrigatórias:
       *    - Bot Token:
       *        files:read
       *        files:write
       *
       * 3º (Opcional) User token:
       *        files:read
       *        files:write
       *
       * 4º Depois disso, estes inputs podem ser adicionados:
       *
       *  {
       *    type: "input",
       *    block_id: "logs",
       *    optional: true,
       *    label: { text: "Logs ou erros relevantes", type: "plain_text" },
       *    element: {
       *      type: "plain_text_input",
       *      action_id: "logs_input",
       *      multiline: true
       *    }
       *  },
       *
       *  {
       *    type: "input",
       *    block_id: "anexos",
       *    optional: true,
       *    label: { text: "Envie anexos", type: "plain_text" },
       *    element: { type: "file_input", action_id: "anexos_input" }
       *  }
       */
    ],
  };
}

//submit
app.view(
  "incidente_modal",
  async ({ ack, view }: { body: any; ack: any; view: any; client: any }) => {
    await ack();

    const vsv = view.state.values;

    const titulo = vsv.titulo.assunto_input?.value ?? "";
    const servico = vsv.servico.servico_input.selected_option?.value ?? "";
    //const urgencia =vsv.prioridade.prioridade_input.selected_option?.value ?? "";
    const descricao = vsv.descricao.descricao_input?.value ?? "";

    console.log("dados do incidente:", {
      titulo,
      servico,
      descricao,
      /*urgencia,*/
    });

    const metadata = JSON.parse(view.private_metadata);
    const channel = metadata.channel;
    const ts = metadata.ts; //  msg específica
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
      /*urgencia: "high", //urgencia,*/
      channel,
      ts: ts, //  msg específica
      thread_ts: thread_ts, //  Thread raiz
    });

    console.log(
      `Incidente criado: #${incident.incident_number} por ${messageAuthorId}`
    );
    console.log(`salvando`);

    saveMessageReference(
      incident.id,                 // ID do PagerDuty
      channel,                    // Canal do Slack
      placeholderTs,             // Timestamp da mensagem do bot
      messageAuthorId,          // Quem criou o incidente
      incident.incident_number // Número do incidente
    );

    console.log(`storage atualizado para incidente: ${incident.id}`);
    console.log(`referencia: ${channel} -> ${placeholderTs}`);
  }
);
