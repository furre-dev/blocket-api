import HttpStatusCode from "../HttpStatusCode";
import { BlocketAPIError } from "../types";
import { BlocketAPIResponse, ExampleListing } from "./blocketTypes";
import { extractFieldsFromCarObject } from "./extractFieldsFromCarObject";

type FirstListingResponse = {
  car: ExampleListing,
  error: null
} | {
  car: null,
  error: BlocketAPIError
}

export const getFirstListing = async (api_url: string): Promise<FirstListingResponse> => {
  try {
    const response = await fetch(api_url);
    const data: BlocketAPIResponse = await response.json();

    // if we can find a car.
    if (data.cars && data.cars[0]) {
      const firstCar = data.cars[0];
      const extractedFieldsFromFirstCar = extractFieldsFromCarObject(firstCar)

      return {
        car: extractedFieldsFromFirstCar,
        error: null
      }
    }

    return {
      car: null,
      error: {
        message: "Could not find any car with the search param",
        code: HttpStatusCode.NOT_FOUND,
        name: "CarNotFound"
      }
    }
  } catch (error) {
    const err = error as Error;

    return {
      car: null,
      error: {
        message: err.message,
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        name: err.name
      }
    }
  }
}