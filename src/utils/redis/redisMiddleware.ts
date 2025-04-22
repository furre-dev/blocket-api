import { NextFunction, Request, Response } from "express";
import { sessionExists } from "./utils/sessionExists";
import { defaultUnathroizedError } from "../createError";

export const redisMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // get the Autorhization bearer token
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(defaultUnathroizedError.code).json({ error: defaultUnathroizedError });
    return;
  }

  // serialize the actual token
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(defaultUnathroizedError.code).json({ error: defaultUnathroizedError });
    return;
  }

  const validSession = await sessionExists(token);

  if (validSession) {
    next();
    return;
  }

  res.status(defaultUnathroizedError.code).json({ error: defaultUnathroizedError });
  return;
}