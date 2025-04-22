import { RedisClientType } from "redis";

export const sessionExists = async (redisClient: RedisClientType<any>, sessionUid: string) => {
  const exists = await redisClient.exists(sessionUid);
  return exists === 1;
}