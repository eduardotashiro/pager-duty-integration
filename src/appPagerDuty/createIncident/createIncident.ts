import { config } from "../../config/env"
import { USER_MAPPING } from "../../config/constants";

export function getAssignedPersonMention(incident: any): string {
  let nomeDoResponsavel = null;

  // estrutura uma porcaria preciso estudar mais 
  if (incident.assignments?.length > 0) {
    const lastAssignment = incident.assignments[incident.assignments.length - 1];
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



export async function createIncident({
  titulo,
  servico,
  descricao,
  urgencia,
  channel,
  ts,
  thread_ts
} : {
  titulo:string, 
  servico: { id: string; type: string }, 
  descricao:string, 
  urgencia:string,
  channel:string,
  ts:string,         // msg especifica da thread
  thread_ts:string  //thread raiz
}) {
 



  const incidentbody = {
    incident: {
      type: "incident",
      title: titulo,
      service: servico,
      body: {
        type: "incident_body",
        details: descricao,
      },
      urgency: urgencia,
    },
  }




  const response = await fetch(`${config.PagerDuty.url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token token=${config.PagerDuty.token}`,
      Accept: "application/vnd.pagerduty+json;version=2",
    },
    body: JSON.stringify(incidentbody),
  });



 const data =await response.json()
 console.log("incidente criado",data)



console.log("Agora bora ver o que tem dentro de assignments huahuahua")
console.log(`assignments completo :`, JSON.stringify(data.incident?.assignments,null,2))


const incidentId = data.incident.id
if (!incidentId) {
  console.error("ERRO: incidentId não encontrado")
  return
}



let slackLink:string
if (thread_ts && thread_ts !== ts) {

  const messageTsFormatted = ts.replace('.', '').padEnd(16, '0'); //preenche o 17 com 0 pq o slack ta chato
  const threadTsFormatted = thread_ts.replace('.', '').padEnd(16, '0');//preenche o 17 com 0 pq o slack ta chato
  
  slackLink = `${config.app.urlThreadLink}/${channel}/p${messageTsFormatted}?thread_ts=${threadTsFormatted}&cid=${channel}`;
} else {
  // Para mensagem FORA de thread ou thread raiz
  slackLink = `${config.app.urlThreadLink}/${channel}/p${ts.replace('.', '').padEnd(16, '0')}`;
}

  console.log('LINK GERADO:', slackLink);


//link slack
const notes= {
  "note": {
    "content":`\nABRA EM UMA NOVA GUIA\nAcesse a Thread do slack aqui: ${slackLink}`
  }
}//   :/

 //cria nota
const responseNotes = await fetch(`${config.PagerDuty.url}/${incidentId}/notes`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
      Authorization: `Token token=${config.PagerDuty.token}`,
      Accept: "application/vnd.pagerduty+json;version=2",
      From:`${config.PagerDuty.email}`
    },
    body: JSON.stringify(notes),
  });

  const notesData = await responseNotes.json()
  console.log("Nota criada com sucesso",notesData)

  return data.incident;
}

