import { connectToRedisClient } from "./redis/connectToRedisClient";
import { Express } from "express";

export async function startServer(app: Express, PORT: string | 3001) {
  try {
    await connectToRedisClient();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to Redis or start the server.", error);
    process.exit(1);
  }
}