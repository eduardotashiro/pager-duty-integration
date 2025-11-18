import { redisStorage } from './redis';

//save redis

export async function saveMessageReference(
  incidentId: string,
  channel: string,
  messageTs: string,
  messageAuthorId: string,
  incidentNumber?: string
) {
  return await redisStorage.saveMessageReference(
    incidentId, 
    channel, 
    messageTs, 
    messageAuthorId, 
    incidentNumber
  );
}

//get redis 
export async function getMessageReference(incidentId: string) {
  return await redisStorage.getMessageReference(incidentId);
}

