import { zodTextFormat } from "openai/helpers/zod";
import { CarSearchResponseObject, ICarSearchQueryType, ICarSearchResponseType, } from "./zodSchema";
import { generateCarModel } from "./generateCarModel";
import { createOpenaiClient } from "./createOpenaiClient";
import { filterInstructions } from "../instructions/filterInstructions";

export async function generateCarSearchFilters(user_input: string) {
  const openai = createOpenaiClient();

  const response = await openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    temperature: 0,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: filterInstructions
          },
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `The car model I am looking for is ${user_input}`
          },
        ]
      }
    ],
    text: {
      format: zodTextFormat(CarSearchResponseObject, "CarSearchResponseObject"),
    },
  });

  const result: ICarSearchResponseType | null = JSON.parse(response.output_text);
  const car_data: ICarSearchQueryType | null = result?.car_data ?? null

  if (car_data) {
    const model_data = await generateCarModel({
      make_brand: car_data.make,
      input: user_input
    });

    if (!model_data) {
      return car_data
    }

    // set models and search_text here =)
    const newResult: ICarSearchQueryType = {
      ...car_data,
      models: model_data.make_model,
      search_text: model_data.search_text,
      engineEffect: model_data.engineEffect
    };

    return newResult
  }

  return null
}