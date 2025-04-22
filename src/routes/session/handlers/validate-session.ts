import express, { Request, Response } from 'express';
import { BlocketAPIError } from '../../../utils/types';
import HttpStatusCode from '../../../utils/HttpStatusCode';
import { sessionExists } from '../../../utils/redis/utils/sessionExists';

export const validateSessionHandler = async (req: Request, res: Response) => {
  const { token } = req.body as { token: string | undefined };
  if (!token) {
    const error: BlocketAPIError = {
      code: HttpStatusCode.BAD_REQUEST,
      message: "please provide a token",
      name: "EmptyToken",
      feedback: null
    }
    res.status(error.code).json({ error: error })
    return;
  }

  const tokenIsValid = await sessionExists(token)

  res.json({ token_is_valid: tokenIsValid })
}