import { App } from "@slack/bolt";
import {config} from "./config/env"


export const app = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
});                                    




import "./appSlack/events/reaction"   ;
import "./appSlack/actions/actions"   ;
import "./appSlack/homeTab/home"      ;




































//https://www.youtube.com/watch?v=OpOgksWFods&list=RDOpOgksWFods&start_radio=1