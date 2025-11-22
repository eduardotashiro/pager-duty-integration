import { app } from "../../app";
import { getMessageReference } from "../storage/messageStorage";
import { USER_MAPPING, TRANSLATE } from "../../config/constants";

async function getAssignedPersonMention(incident: any): Promise<string> {
  //rettorna uma promise de string
  let nomeDoResponsavel = null;

  if (incident.assignments?.length > 0) {
    const lastAssignment =
      incident.assignments[incident.assignments.length - 1];
    nomeDoResponsavel = lastAssignment.assignee?.summary;
  } else if (incident.assignees?.length > 0) {
    nomeDoResponsavel = incident.assignees[0]?.summary;
  } else if (incident.agent?.summary) {
    nomeDoResponsavel = incident.agent.summary;
  }

  if (nomeDoResponsavel) {
    const slackId = USER_MAPPING[nomeDoResponsavel];
    return slackId ? `<@${slackId}>` : `*${nomeDoResponsavel}*`;
  }

  return "*Aguardando Atribuição*";
}

export async function updateIncidentMessage(
  incidentId: string,
  eventType: string,
  incidentData: any,
  agente: any
) {
  try {
    const messageRef = await getMessageReference(incidentId);

    const incidentNumber = incidentData.number;

    const stt = TRANSLATE[incidentData.status] || "Em andamento";

    if (eventType === "incident.triggered") {
      const assigneeMention = await getAssignedPersonMention(incidentData);

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `Incidente #${incidentNumber} criado com sucesso!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:pagerduty: *Incidente #${incidentNumber}*`, //:pagerduty-seeklogo: - dev  | :pagerduty: - firma
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${messageRef.messageAuthorId}> sua solicitação foi registrada e nossa equipe técnica foi notificada.`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `•   *Prioridade:* \`${incidentData.urgency === "high" ? "Alta" : "Baixa"}\``,
              },
              {
                type: "mrkdwn",
                text: `•   *Status:* \` ${stt} \``,
              },
              {
                type: "mrkdwn",
                text: `•   *Responsável:* \` ${assigneeMention} \``,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "```Retornaremos nesta mensagem com uma atualização assim que o incidente for resolvido.```",
            },
          },
        ],
      });
    } else if (eventType === "incident.escalated") {
      const assigneeMention = await getAssignedPersonMention(incidentData);

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `Incidente #${incidentNumber} atualizado!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:pagerduty: *Incidente #${incidentNumber}*`, //:pagerduty-seeklogo: - dev  | :pagerduty: - firma
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${messageRef.messageAuthorId}> sua solicitação foi registrada e nossa equipe técnica foi notificada.`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `•   *Prioridade:* \`${incidentData.urgency === "high" ? "Alta" : "Baixa"}\``,
              },
              {
                type: "mrkdwn",
                text: `•   *Status:* \` ${stt} \``,
              },
              {
                type: "mrkdwn",
                text: `•   *Responsável:* \` ${assigneeMention} \``,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "```Retornaremos nesta mensagem com uma atualização assim que o incidente for resolvido.```",
            },
          },
        ],
      });
    } else if (eventType === "incident.resolved") {
      // objeto com agent porque no resolved ele vem separado
      const resolvedByMention = await getAssignedPersonMention({
        agent: agente,
      });

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `Incidente Resolvido no PagerDuty!`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:pagerduty: *Incidente #${incidentNumber}*`, //:pagerduty-seeklogo: - dev  | :pagerduty: - firma
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${messageRef.messageAuthorId}>, informamos que o seu incidente foi resolvido com sucesso!`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `•   *Prioridade:* \`${incidentData.urgency === "high" ? "Alta" : "Baixa"}\``,
              },
              {
                type: "mrkdwn",
                text: `•   *Status:* \` ${stt} \``,
              },
              {
                type: "mrkdwn",
                text: `•   *Responsável:* \` ${resolvedByMention} \``,
              },
            ],
          },
        ],
      });
    }
  } catch (error) {
    console.error(`erro ao atualizar mensagem:`, error);
  }
}
