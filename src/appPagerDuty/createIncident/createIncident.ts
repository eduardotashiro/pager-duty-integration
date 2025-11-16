import { config } from "../../config/env"
import { USER_MAPPING } from "../../config/constants";

 console.log("bora ver se consigo pegar as info...")

export function getAssignedPersonMention(incident:any) {

if (!incident.assignments || incident.assignments.length === 0 ) {
  return `*Aguardando Atribuição.*`
}


 // pega smp o ultimo lk


const lastAssignee = incident.assignments[incident.assignments.length - 1] ; // ultimo [] dos loko

const nomeDoLouco = lastAssignee.assignee?.summary

if (!nomeDoLouco) {
  return `*Aguardando Atribuição*`
}

const slackiddoloko = USER_MAPPING[nomeDoLouco]

if (slackiddoloko) {
  return `<@${slackiddoloko}>`
} else{
  return `*${nomeDoLouco}*`
  
}
  



  /*const pegaLoko = incident 
  const bora = pegaLoko.assignments[0]
  const nomedoloko = bora.assignee.summary

  if (!nomedoloko || pegaLoko.assignments.length === 0) {
    return `Aguardando atribuição`
  }
  const slackiddoloko = USER_MAPPING[nomedoloko]

  if (slackiddoloko) {
    return `<@${slackiddoloko}>`
  }else{
    return `*${nomedoloko}*`
  }*/
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





export async function getIncident(incidentId: string) {
  try {
    const response = await fetch(`${config.PagerDuty.url}/${incidentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${config.PagerDuty.token}`,
        Accept: "application/vnd.pagerduty+json;version=2",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PagerDuty API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.incident;
    
  } catch (error) {
    console.error("Erro ao buscar incidente:", error);
    throw error;
  }
}



