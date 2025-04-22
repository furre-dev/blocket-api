import HttpStatusCode from "./HttpStatusCode";

export type BlocketAPIError = Error & { code: HttpStatusCode, feedback: string | null }
