import { Request, Response } from 'express';
import { generateCarSearchFilters } from '../../../utils/blocket/ai-utils/generateCarSearchFilters';
import { BlocketAPIError } from '../../../utils/types';
import HttpStatusCode from '../../../utils/HttpStatusCode';
import { createUrlFromSearchFilters } from '../../../utils/blocket/filters/createUrlFromSearchFilters';
import { getFirstListing } from '../../../utils/blocket/getFirstListing';

export const createFilterFromQueryHandler = async (req: Request, res: Response) => {
  const { search_query } = req.body as { search_query: string };

  try {
    const result = await generateCarSearchFilters(search_query);

    if (!result) {
      const error: BlocketAPIError = {
        code: HttpStatusCode.BAD_REQUEST,
        message: "Could not create any filtering from search query.",
        name: "FailedFilterCreation",
        feedback: null
      }

      res.status(error.code).json({ error: error });
      return;
    }

    const urlsResponse = createUrlFromSearchFilters(result);

    if (urlsResponse.error) {
      res.status(urlsResponse.error.code).json({ error: urlsResponse.error });
      return;
    }

    const firstListingResponse = await getFirstListing(urlsResponse.api_url);

    if (firstListingResponse.error) {
      res.status(firstListingResponse.error.code).json({ error: firstListingResponse.error });
      return;
    }

    const responseObject = {
      web_url: urlsResponse.web_url,
      example_listing: firstListingResponse.car
    }

    res.json({ data: responseObject });
    return;
  } catch (error) {
    const catchedError = error as Error;

    const err: BlocketAPIError = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: catchedError.message,
      name: catchedError.name,
      feedback: null
    }

    res.status(err.code).json({ error: err });
    return;
  }
}