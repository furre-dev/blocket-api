import { Router } from "express";
import { createFilterFromQueryHandler } from "./handlers/createFilterFromQueryHandler";
import { redisMiddleware } from "../../utils/redis/redisMiddleware";
import { validateSearchQuery } from "../../utils/validation/validateSearchQuery";

export const filterRoutes = Router();

filterRoutes.post(
  "/create-filters-from-query",
  redisMiddleware,
  validateSearchQuery,
  createFilterFromQueryHandler
);
