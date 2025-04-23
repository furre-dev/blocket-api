import express from 'express';
import cors from "cors";
import { rateLimiter } from './utils/rateLimiter';
import { startServer } from './utils/startServer';
import { apiV1Router } from './routes/apis/v1/route';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(helmet());


if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

app.set('trust proxy', true);

const PORT = process.env.PORT || 3001;

// start server, for example here connect to redis
startServer(app, PORT).catch((e) => {
  throw new Error(e)
});

// rate limit the wole api
app.use(rateLimiter(30));

// use routes
app.use("/api/v1", apiV1Router)