import express, { Request, Response } from 'express';
import { defaultCatchError } from "../../../utils/createError";
import { createSession } from "../../../utils/redis/utils/createSession";

export const createSessionHandler = async (req: Request, res: Response) => {
  try {
    const newSession = await createSession();
    res.json({ token: newSession })
  } catch (error) {
    const catchError = defaultCatchError(error)
    res.status(catchError.code).json({ error: catchError })
  }
}