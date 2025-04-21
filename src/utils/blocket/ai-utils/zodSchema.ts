import { z } from "zod"
import { allBrands } from "../allCarModels"

export const CarSearchObject = z.object({
  make: z.union([z.array(z.enum(allBrands)), z.null()]),
  models: z.union([z.array(z.string()), z.null()]),
  fuel: z.union([z.array(z.enum(["Bensin", "Diesel", "El", "Miljöbränsle/Hybrid"])), z.null()]),
  chassi: z.union([z.array(z.enum(["SUV", "Cab", "Coupé", "Familjbuss", "Halvkombi", "Kombi", "Sedan", "Yrkesfordon"])), z.null()]),
  price: z.object({
    from: z.union([z.string(), z.null()]),
    to: z.union([z.string(), z.null()]),
  }),
  modelYear: z.object({
    from: z.union([z.string(), z.null()]),
    to: z.union([z.string(), z.null()]),
  }),
  milage: z.object({
    from: z.union([z.string(), z.null()]),
    to: z.union([z.string(), z.null()]),
  }),
  gearbox: z.union([z.array(z.enum(["Automat", "Manuell"])), z.null()]),
  search_text: z.union([z.string(), z.null()]),
  color: z.union([z.array(z.enum([
    "Blå",
    "Brun",
    "Grå",
    "Grön",
    "Gul",
    "Röd",
    "Svart",
    "Vit"
  ])), z.null()]),
  drivetrain: z.union([z.array(z.enum(["Fyrhjulsdriven", "Tvåhjulsdriven"])), z.null()]),
  engineEffect: z.object({
    from: z.union([z.string(), z.null()]),
    to: z.union([z.string(), z.null()]),
  }),
});

export const CarSearchResponseObject = z.object({
  car_data: z.union([CarSearchObject, z.null()])
})

export type ICarSearchResponseType = z.infer<typeof CarSearchResponseObject>;

//The enum is the expected schema response from the AI, and ICarSearchQueryType is the schema that we want to pass when setting data and creating blocket url.
export type ICarSearchQueryType = z.infer<typeof CarSearchObject>;
