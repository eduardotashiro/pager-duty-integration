import { StoredIncident } from "./types";
import fs from "fs/promises";
import path from "path";

const INCIDENTS_FILE = path.resolve(process.cwd(), "incidents.json");


// Salvar incidente
export async function saveIncident(incident: StoredIncident) {
  try {
    console.log(` Tentando salvar incidente ${incident.incidentNumber} no: ${INCIDENTS_FILE}`)
    
    let incidents: StoredIncident[] = [];

 
      const data = await fs.readFile(INCIDENTS_FILE, 'utf-8')
      const json = JSON.parse(data)
      incidents = json.incidents || []
      console.log(` ${incidents.length} incidentes do arquivo`)

   

    const incidentComplete = {
      ...incident,
      //dados brutos para asseretividade 
      currentAssignedTo: getCurrentAssignedPerson(incident.rawPagerDutyData || incident), //function new mdfck
      lastAssignmentCheck: new Date() ,
      rawPagerDutyData: incident.rawPagerDutyData
    }

    incidents.push(incidentComplete);
    console.log(`Incidente ${incident.incidentNumber} adicionado à lista`);

    await fs.writeFile(
      INCIDENTS_FILE, 
      JSON.stringify({ incidents }, null, 2),
      'utf-8'
    )
    console.log(`Incidente ${incident.incidentNumber} salvo com sucesso!`);
    
  } catch (error) {
    console.error(` ERRO ao salvar incidente ${incident.incidentNumber}:`, error)
  }
}


//pega ultima pessoa da lista papaii

export function getCurrentAssignedPerson(incidentData:any) {
  if (!incidentData.assignments || incidentData.assignments.length === 0 ) {
    return "Aguardando Atribuição"
  }

  const assignments = incidentData.assignments;
  const ultimoAssignment = assignments[assignments.length - 1]
  return ultimoAssignment.assignee?.summary || "Aguardando Atribuição"
}




//Buscar todos os incidentes
export async function getAllIncidents(): Promise<StoredIncident[]> {
  try {
    const data = await fs.readFile(INCIDENTS_FILE, 'utf-8');
    const json = JSON.parse(data);
    return json.incidents || [];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}






//Atualizar status de um incidente
export async function updateIncidentStatus(
  incidentId: string, 
  newStatus: "triggered" | "resolved", 
  resolvedBy?: string
): Promise<void> {
  try {
    const incidents = await getAllIncidents();
    const incidentIndex = incidents.findIndex(inc => inc.incidentId === incidentId);
    
    if (incidentIndex === -1) {
      console.log(`Incidente ${incidentId} não encontrado no histórico`);
      return;
    }

    incidents[incidentIndex].status = newStatus;
    if (newStatus === "resolved" && resolvedBy) {
      incidents[incidentIndex].resolvedBy = resolvedBy;
      incidents[incidentIndex].resolvedAt = new Date();
    }

    await fs.writeFile(
      INCIDENTS_FILE,
      JSON.stringify({ incidents }, null, 2),
      'utf-8'
    );

    console.log(`Status do incidente ${incidentId} atualizado para: ${newStatus}`);
  } catch (error) {
    console.error(`Erro ao atualizar incidente ${incidentId}:`, error);
  }
}

//CORREÇÃO: RENOMEAR PARA EVITAR CONFLITO
export async function getIncidentFromHistory(incidentId: string): Promise<StoredIncident | undefined> {
  const incidents = await getAllIncidents();
  return incidents.find(inc => inc.incidentId === incidentId);
}




// Atualiza apenas a pessoa
export async function updateIncidentAssignment(incidentId:string,novaPessoa:string) {
  try {
    const incidents = await getAllIncidents()
    const incidentIndex = incidents.findIndex(inc => inc.incidentId === incidentId )

    if (incidentIndex === -1) {
      console.log(`incidente ${incidentId} n encontrado`)
      return //n esquece
    }

    //atualizar o mano
    incidents[incidentIndex].currentAssignedTo = novaPessoa
    incidents[incidentIndex].lastAssignmentCheck = new Date();

    await fs.writeFile(
      INCIDENTS_FILE,
      JSON.stringify({incidents}, null, 2),'utf-8'
    )
      console.log(`Pessoa do incidente ${incidentId} atualizada para: ${novaPessoa}`);
 
    } catch (error) {
    console.error("error #%d", error)
  }
}