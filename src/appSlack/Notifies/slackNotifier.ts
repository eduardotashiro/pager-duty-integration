import { getMessageReference } from "../storage/messageStorage";
import { app } from "../../app";
import { getAssignedPersonMention } from "../../appPagerDuty/createIncident/createIncident";

/*function statusTranslate(status: string): string {
  const traducoes: { [key: string]: string } = {
    'triggered': 'Em andamento',
    'acknowledged': 'Assumido', 
    'resolved': 'Resolvido'
  };
  return traducoes[status] || 'Em andamento';
}*/

export async function updateIncidentMessage(
  incidentId: string,
  eventType: string,
  incidentData: any,
  agente: any
) {
  try {
    const messageRef = await getMessageReference(incidentId);
    
    if (!messageRef) {
      console.log(`mensagem não encontrada para ${incidentId}`);
      return;
    }

    const incidentNumber = incidentData.number;
   // const stt = statusTranslate(incidentData.status);

    if (eventType === "incident.triggered") {
      const assigneeMention = getAssignedPersonMention(incidentData);

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `Incidente #${incidentNumber} criado com sucesso!`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Incidente #${incidentNumber} Criado com Sucesso no :pagerduty-seeklogo:ager Duty !`,
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${messageRef.messageAuthorId}> sua solicitação foi registrada e nossa equipe técnica foi notificada.`
            }
          },
          {
            type: "section", 
            fields: [
              {
                type: "mrkdwn",
                text: `*Prioridade:* ${incidentData.urgency === 'high' ? 'Alta' : 'Baixa'}`
              },
             /* {
                type: "mrkdwn",
                text: `*Status:* ${stt}`
              },*/
              {
                type: "mrkdwn",
                text: `*Atribuído para:* ${assigneeMention}`
              }
            ]
          },
          {
            type: "section",
            text: 
              {
                type: "mrkdwn",
                text: ">Retornaremos nesta mensagem com uma atualização assim que o incidente for resolvido."
              }
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
      })
    } else if (eventType === "incident.escalated"){
 const assigneeMention = getAssignedPersonMention(incidentData);

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `Incidente #${incidentNumber} criado com sucesso!`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Incidente #${incidentNumber} Criado com Sucesso no :pagerduty-seeklogo:ager Duty !`,
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${messageRef.messageAuthorId}> sua solicitação foi registrada e nossa equipe técnica foi notificada.`
            }
          },
          {
            type: "section", 
            fields: [
              {
                type: "mrkdwn",
                text: `*Prioridade:* ${incidentData.urgency === 'high' ? 'Alta' : 'Baixa'}`
              },
             /* {
                type: "mrkdwn",
                text: `*Status:* ${stt}`
              },*/
              {
                type: "mrkdwn",
                text: `*Atribuído para:* ${assigneeMention}`
              },
              {
                type: "mrkdwn",
                text: `*Reatribuido para:* ${assigneeMention}`
              }
            ]
          },
          {
            type: "section",
            text: 
              {
                type: "mrkdwn",
                text: ">Retornaremos nesta mensagem com uma atualização assim que o incidente for resolvido."
              }
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
      })
    }  else if (eventType === "incident.resolved") {
      const resolvedByMention = getAssignedPersonMention({ agent: agente });

      await app.client.chat.update({
        channel: messageRef.channel,
        ts: messageRef.messageTs,
        text: `🎉 Incidente Resolvido no PagerDuty!`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `Incidente #${incidentNumber} Resolvido no :pagerduty-seeklogo:ager Duty !`,
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Ótima notícia <@${messageRef.messageAuthorId}>, informamos que o seu incidente foi resolvido com sucesso!`
            }
          },
          {
            type: "section", 
            fields: [
              {
                type: "mrkdwn",
                text: `*Responsável pela resolução:* ${resolvedByMention}`
              },
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `>Precisa de suporte adicional ? Envie sua dúvida e reaja com :sos: para que um chamado seja criado automaticamente em nossa central de ajuda !`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Última atualização: ${new Date().toLocaleString('pt-BR')} | TUNA :cactus:`
              }
            ]
          }
        ]
      });
    }

  } catch (error) {
    console.error(`erro ao atualizar mensagem:`, error);
  }
}