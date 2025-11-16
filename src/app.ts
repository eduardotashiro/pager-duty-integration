import { App,ExpressReceiver,LogLevel } from "@slack/bolt";
import {config} from "./config/env"
import express from "express";

//https://github.com/slackapi/bolt-js/blob/main/examples/oauth-express-receiver/app.js
//O PagerDuty espera uma resposta 2xx em até 5 segundos para webhooks genéricos e em até 16 segundos para webhooks gerados a partir de ações de incidentes personalizadas.
                            
export const receiver = new ExpressReceiver({
  signingSecret:config.slack.signingSecret,
  clientId:config.slack.clientID,
  clientSecret:config.slack.clientSecret
})

export const app = new App({
  receiver,
  logLevel:LogLevel.INFO, // set loglevel at the App level
  token: config.slack.botToken
});     

receiver.app.use(express.json());

receiver.app.post('/webhook/pagerduty', (req, res) => {

  console.log("retorno do pager teste", req.body);
  
  res.status(200).send('tudo safe');
});


import "./appSlack/events/reaction"   ;
import "./appSlack/actions/actions"   ;
import "./appSlack/homeTab/home"      ;




































//https://www.youtube.com/watch?v=OpOgksWFods&list=RDOpOgksWFods&start_radio=1