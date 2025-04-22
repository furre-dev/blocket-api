import rateLimit from "express-rate-limit";

export const rateLimiter = (limit: number) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  })
}

