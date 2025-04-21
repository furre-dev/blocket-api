"use server"
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getAllModelsForCurrentBrand } from "../allCarModels";
import { createOpenaiClient } from "./createOpenaiClient";
import { modelInstructions } from "../instructions/modelInstructions";
import { getModelSpecificInstructions, modelSpecificInstructionsMap } from "../instructions/modelSpecificInstructions";
import { EasyInputMessage } from "openai/resources/responses/responses";
import { CarSearchObject } from "./zodSchema";

export async function generateCarModel({ make_brand, input }: { make_brand: string[] | null, input: string }) {
  if (!make_brand) {
    return null
  }

  const openai = createOpenaiClient();

  const ZodSchema = createZodSchema(make_brand);

  if (!ZodSchema) {
    return null;
  }

  type ICarModelResponse = z.infer<typeof ZodSchema>;

  const inputs: EasyInputMessage[] = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: modelInstructions
        },
      ]
    }
  ]

  const modelSpecificInstructions = getModelSpecificInstructions(make_brand);
  modelSpecificInstructions?.forEach((i) => {
    inputs.push(i)
  })

  inputs.push(
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: `
            Car brand that is already selected: ${make_brand}
            The whole message: ${input}`
        },
      ]
    }
  )

  const response = await openai.responses.create({
    model: "gpt-4.1-2025-04-14",
    temperature: 0,
    input: inputs,
    text: {
      format: zodTextFormat(ZodSchema, "CarSearchResponse"),
    },
  });

  const result: ICarModelResponse | null = JSON.parse(response.output_text);

  if (!result) {
    return null
  }

  return result
}

const createZodSchema = (make_brand: string[]) => {
  const models = getAllModelsForCurrentBrand(make_brand) as [string, ...string[]];

  if (!models) {
    return null
  }

  const CarModelResponseFormat = z.object({
    make_model: z.union([z.array(z.enum(models)), z.null()]),
    search_text: CarSearchObject.shape.search_text,
    engineEffect: CarSearchObject.shape.engineEffect,
  })

  return CarModelResponseFormat
}