import { createClient, RedisClientType } from 'redis';

export const redisClient: RedisClientType = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 15659
  }
});
