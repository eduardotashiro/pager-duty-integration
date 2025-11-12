import { config } from "../../config/env"

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
  thread_ts:string  //thread root
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




const incidentId = data.incident.id
if (!incidentId) {
  console.error("ERRO: incidentId não encontrado")
  return
}



let slackLink:string
if (thread_ts && thread_ts !== ts) {

  const messageTsFormatted = ts.replace('.', '').padEnd(16, '0');
  const threadTsFormatted = thread_ts.replace('.', '').padEnd(16, '0');
  
  slackLink = `${config.app.urlThreadLink}/${channel}/p${messageTsFormatted}?thread_ts=${threadTsFormatted}&cid=${channel}`;
} else {
  // Para mensagem FORA de thread ou thread raiz
  slackLink = `${config.app.urlThreadLink}/${channel}/p${ts.replace('.', '').padEnd(16, '0')}`;
}

  console.log('🔗 Link GERADO:', slackLink);


//link slack
const notes= {
  "note": {
    "content":`\nABRA EM UMA NOVA GUIA\nAcesse a thread no slack aqui: ${slackLink}`
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
}