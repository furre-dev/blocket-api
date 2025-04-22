import { redisClient } from "../redisClient";

export const sessionExists = async (sessionUid: string) => {
  const exists = await redisClient.exists(sessionUid);
  return exists === 1;
}