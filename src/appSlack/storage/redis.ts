import { createClient } from "redis";
import { config } from "../../config/env";

// classe fala c redis
export class Redis$torage {
  private client;

  // conection config
  constructor() {
    console.log("Iniciando primeira conexão com redis...");

    
    this.client = createClient({
      url: config.redis.redisUrl,
    });
    this.connect();
  }

  // methotd connect
  async connect() {
    try {
    await this.client.connect(); 
      console.log(`conectado ao redis`);
    } catch (error) {
      console.error("err: redis não conectado:", error);
      throw error; // eu paro se não conecta
    }
  }

  // save in redis
  async saveMessageReference(
    incidentId: string,               // ID do incidente (chave)
    channel: string,                 // Canal do Slack
    messageTs: string,              // Timestamp da mensagem
    messageAuthorId: string,       // Quem criou
    incidentNumber?: string,      // Número do incidente
  ) {
    try {

      // dados p/ salvar
      const data = {
        incidentId,
        channel,
        messageTs,
        messageAuthorId,
        incidentNumber,
        savedAt: new Date().toISOString(), // Quando foi salvo
      };

      // dados persiste po 24h
      console.log(`salvo no redis: ${incidentId} -> ${messageTs}`);


      await this.client.setEx(
        `incident:${incidentId}`,         // Chave: "incident:Q1A2B3C4"
        86400,                           // 24h em seg
        JSON.stringify(data)            // dados string
      );

    
      console.log(`teste salvou mesmo ? ${incidentId} -> ${messageTs}`);
      return true;
    } catch (error) {
      console.error(`erro ao salvar no Redis:`, error);
      return false;
    }
  }


  //get redis 
  async getMessageReference(incidentId: string) {
    try {
      // busca por chave
      const data = await this.client.get(`incident:${incidentId}`);
      
      if (data) {
        console.log(`encontrado no redis: ${incidentId}`);
        return JSON.parse(data); // Converte string para objeto
      }
      
      console.log(`não encontrado no redis: ${incidentId}`);
      return null;
    } catch (error) {
      console.error(`erro ao buscar no Redis:`, error);
      return null;
    }
  }
}

// instância global, conexão unica
export const redisStorage = new Redis$torage();




