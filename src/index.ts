import express from 'express';
import cors from "cors";
import { rateLimiter } from './utils/rateLimiter';
import { startServer } from './utils/startServer';
import { apiV1Router } from './routes/apis/v1/route';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

const PORT = process.env.PORT || 3001;

// start server, for example here connect to redis
(async () => { await startServer(app, PORT); })()

// rate limit the wole api
app.use(rateLimiter(30));

// use routes
app.use("/api/v1", apiV1Router)


