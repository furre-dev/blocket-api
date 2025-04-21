import { BlocketAPIResponse, CarListing, ExampleListing } from "../types";
import { extractFieldsFromCarObject } from "./extractFieldsFromCarObject";

type Errors = {
  message: "Could not create the Blocket API url",
  code: 400
} | {
  message: "Could not find any car with the search param",
  code: 404
}

type FirstListingResponse = {
  car: ExampleListing,
  error: undefined
} | {
  car: null,
  error: Errors
}

export const getFirstListing = async (api_url: string | null): Promise<FirstListingResponse> => {
  if (!api_url) return {
    car: null,
    error: {
      message: "Could not create the Blocket API url",
      code: 400
    }
  };

  const response = await fetch(api_url);
  const data: BlocketAPIResponse = await response.json();

  // if we can find a car.
  if (data.cars && data.cars[0]) {
    const firstCar = data.cars[0];
    const extractedFieldsFromFirstCar = extractFieldsFromCarObject(firstCar)

    return {
      car: extractedFieldsFromFirstCar,
      error: undefined
    }
  }

  return {
    car: null,
    error: {
      message: "Could not find any car with the search param",
      code: 404
    }
  }

}