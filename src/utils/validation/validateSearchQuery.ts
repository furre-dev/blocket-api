import { NextFunction, Request, Response } from "express";
import { BlocketAPIError } from "../types";
import HttpStatusCode from "../HttpStatusCode";
import { giveFeedbackOnBadQuery } from "./giveFeedbackOnBadQuery";

export const validateSearchQuery = async (req: Request, res: Response, next: NextFunction) => {
  const { search_query } = req.body || {};

  if (!search_query) {
    const error: BlocketAPIError = {
      code: HttpStatusCode.BAD_REQUEST,
      message: "Missing search_query",
      name: "MissingSearchQuery",
      feedback: null
    }
    res.status(error.code).json({ error: error });
    return;
  }

  const { isValidQuery, feedbackIfNotValid } = await giveFeedbackOnBadQuery(search_query);

  if (isValidQuery) {
    next();
    return;
  }

  const queryIsNotValidError: BlocketAPIError = {
    code: HttpStatusCode.BAD_REQUEST,
    message: "Search query is not a valid car search query.",
    name: "InvalidSearchQuery",
    feedback: feedbackIfNotValid
  }

  res.status(queryIsNotValidError.code).json({ error: queryIsNotValidError });
  return;
}