import { Router } from "express";
import { sessionRoutes } from "../../session/session";
import { filterRoutes } from "../../filters/filters";

export const apiV1Router = Router();

apiV1Router.use(sessionRoutes)
apiV1Router.use(filterRoutes);
