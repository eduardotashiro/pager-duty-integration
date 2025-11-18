import { App, ExpressReceiver, LogLevel } from "@slack/bolt";
import { config } from "./config/env";
import express from "express";
import { updateIncidentMessage } from "./appSlack/Notifies/slackNotifier";
//import rateLimit from "express-rate-limit"; 

export const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  clientId: config.slack.clientID,
  clientSecret: config.slack.clientSecret,
});

export const app = new App({
  receiver,
  logLevel: LogLevel.INFO,
  token: config.slack.botToken,
});

receiver.app.use(express.json());

/*
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 50,                // máximo 50 requisições/min
  message: "Estão querendo invadir, calma ae"
});*/

receiver.app.post("/webhook/pagerduty", /*webhookLimiter,*/ async (req, res) => {
  res.status(200).send("OK");

  const eventType = req.body.event?.event_type;
  const incidentData = req.body.event?.data;
  const incidentId = incidentData?.id;
  const agente = req.body.event?.agent;

console.log(`evento: ${eventType}`)
console.log(`dados do evento: `,incidentData)
console.log("dados",incidentData)
console.log("pessoa que resolveu",agente) //.summary
  // filtro
  const importantEvents = ["incident.triggered", "incident.resolved", "incident.escalated"] //incident.escalated
  
  if (!importantEvents.includes(eventType)) {
    console.log(`Evento ignorado: ${eventType}`)
    return;
  }

  console.log(`Processando: ${eventType} para ${incidentId}`);

  if (eventType && incidentId) {
    // pausa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await updateIncidentMessage(
      incidentId,
      eventType,
      incidentData,
      agente
    );
  }
});


import "./appSlack/events/reaction";
import "./appSlack/actions/actions"; 
import "./appSlack/homeTab/home";
