import { createClient, RedisClientType } from 'redis';
import 'dotenv/config';

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL
});
