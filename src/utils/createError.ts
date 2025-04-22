import HttpStatusCode from "./HttpStatusCode"
import { BlocketAPIError } from "./types"

export const createError = (code: HttpStatusCode, message: string, name: string, feedback?: string,) => {
  const error: BlocketAPIError = {
    code,
    message,
    name,
    feedback: feedback ?? null
  }

  return error
}

export const defaultUnathroizedError: BlocketAPIError = {
  code: HttpStatusCode.UNAUTHORIZED,
  message: "unathorized",
  name: "Unathorized",
  feedback: null
}

export const defaultCatchError = (error: unknown): BlocketAPIError => {
  const err = error as Error;

  return {
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: err.message,
    name: err.name,
    feedback: null
  }
} 