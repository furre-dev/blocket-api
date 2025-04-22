import { zodTextFormat } from "openai/helpers/zod";
import { createOpenaiClient } from "../blocket/ai-utils/createOpenaiClient";
import { feedbackInstructions } from "./instructions/feedbackInstructions";
import { IsValidQuerySchema, IValidQuerySchemaType } from "./zodSchema";

export const giveFeedbackOnBadQuery = async (search_query: string) => {
  const openai = createOpenaiClient();

  const response = await openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    temperature: 1.5,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: feedbackInstructions
          },
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: search_query
          },
        ]
      }
    ],
    text: {
      format: zodTextFormat(IsValidQuerySchema, "IsValidQuerySchema"),
    },
  });

  const result: IValidQuerySchemaType = JSON.parse(response.output_text);

  return result
}