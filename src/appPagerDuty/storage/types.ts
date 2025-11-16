
export interface StoredIncident {
 
  incidentId: string;           // ID do pager
  incidentNumber: number;       // nº do incidente
  
  // Slack
  channel: string;              // ID do canal 
  messageTs: string;            // ts da msg do bot
  messageAuthorId: string;      // ID de quem chamou (tuna incidents (enjoei do nome))
  
  // Status 
  status: "triggered" | "resolved";
  createdAt: Date;              // Quando foi criado
  resolvedAt?: Date;            // Quando foi resolvido
  resolvedBy?: string;          // Quem resolveu ? meus parachoque

  //Controle para verificar o próximo lk atribuido
  currentAssignedTo?: string    // quem esta atribuido atualmente!!
  lastAssignmentCheck?:Date    // quem esta atribuido por ultimo, new Date()!!
  
  // info do incidente 
  title?: string;               
  service?: string;             
  urgency?: "high" | "low",
  rawPagerDutyData?: any     // Prioridade
}


