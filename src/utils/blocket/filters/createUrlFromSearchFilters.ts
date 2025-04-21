import { ICarSearchQueryType } from "../ai-utils/zodSchema";
import { buildFilter } from "./buildFilter";
import { generateBlocketUrl } from "../generateBlocketUrl";

// TODO: Handle object/array types better. Not clean right now!

type UrlResponse = {
  api_url: string | null,
  web_url: string | null,
}

const API_URL = process.env.BLOCKET_API_URL;
const WEB_URL = "https://www.blocket.se/bilar/sok"

export function createUrlFromSearchFilters(filtered_search_obj: ICarSearchQueryType): UrlResponse {
  let filtersArr = [];
  let searchQuery: string | null = null;

  if (!filtered_search_obj) return { api_url: null, web_url: null };

  let filter: keyof ICarSearchQueryType;

  for (filter in filtered_search_obj) {
    const filterValue = filtered_search_obj[filter];

    if (!filterValue) continue;

    if (typeof filterValue === "string") {
      // if the filtername is search_text, then we assign the search_text to the searchQuery, else we push the string into the filters array.
      if (filter === "search_text") {
        searchQuery = filterValue;
        continue;
      }
      /* filtersArr.push(`filter=${encodeURIComponent(JSON.stringify({
        key: filter,
        values: filterValue 
      }))}`); */
      filtersArr.push(buildFilter(filter, { values: filterValue }))
      continue;
    }
    // Here we check if the filter is of type Array, and if it has any items.
    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        filtersArr.push(buildFilter(filter, { values: filterValue }))
        continue;
      }
      continue;
    }

    // if both "from" and "to" in the range object is null, continue to next loop.
    if (!filterValue.from && !filterValue.to) {
      continue;
    }

    // if none of these above, it means the filterValue  is of type "RANGE".
    filtersArr.push(buildFilter(filter, {
      range: {
        start: filterValue.from,
        end: filterValue.to
      }
    }))
  }

  if (!API_URL) {
    throw new Error("BLOCKET_API_URL env variable not found")
  }

  const api_url = API_URL ? generateBlocketUrl(API_URL, filtersArr, searchQuery) : null
  const web_url = generateBlocketUrl(WEB_URL, filtersArr, searchQuery)


  return { api_url, web_url };
}

