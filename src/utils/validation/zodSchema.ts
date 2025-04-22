import z from "zod"

export const IsValidQuerySchema = z.object({
  isValidQuery: z.boolean(),
  feedbackIfNotValid: z.union([z.string(), z.null()])
})

export type IValidQuerySchemaType = z.infer<typeof IsValidQuerySchema>;