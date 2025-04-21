
import { BlocketAPIResponse, CarListing } from "./blocketTypes";
import { generateModelMakeCarSearchURL } from "./filters/generateModelMakeCarSearchURL";
import { MakeAndModelInput } from "./makeAndModelTypes";

export async function fetchBlocketListings(make_and_model: MakeAndModelInput) {
  let page = 1;

  const listings: CarListing[] = []

  // loop through all the listings until we can't find any listings anymore
  while (true) {
    const makeModelBlocketApiUrl = generateModelMakeCarSearchURL(make_and_model, page);

    if (!makeModelBlocketApiUrl) {
      return;
    }

    const response = await fetch(makeModelBlocketApiUrl);
    const data: BlocketAPIResponse = await response.json();

    // when page limit is exceeded the cars field will be set to "null" by blocket api.
    if (data.cars === null) {
      console.log(makeModelBlocketApiUrl);
      break;
    }

    data.cars.map((carListing) => {
      listings.push(carListing)
    })

    page++;
  }

  return listings
}