import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../redisClient';

const minutesToSeconds = (minutes: number) => minutes * 60;

const SESSION_EXPIRY_MINUTES = 60;

export const createSession = async () => {
  const uuid = uuidv4();
  await redisClient.set(uuid, '1', { EX: minutesToSeconds(SESSION_EXPIRY_MINUTES) });

  return uuid;
}