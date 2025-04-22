import { Router } from "express";
import { rateLimiter } from "../../utils/rateLimiter";
import { createSessionHandler } from "./handlers/create-session";
import { validateSessionHandler } from "./handlers/validate-session";

export const sessionRoutes = Router();

sessionRoutes.get("/create-session", rateLimiter(5), createSessionHandler);
sessionRoutes.post("/validate-token", validateSessionHandler);
