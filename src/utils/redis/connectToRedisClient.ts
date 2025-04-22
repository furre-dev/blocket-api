import { redisClient } from "./redisClient";

export const connectToRedisClient = async () => {
  // Connect to our redis client
  console.log("Connecting to client")
  redisClient.on('error', err => {
    throw new Error(`Redis Client Error: ${err}`)
  });

  await redisClient.connect();
  console.log("Connected to client");

  return true;
}