import express, { Request, Response } from 'express';
import cors from "cors"
import { generateCarSearchFilters } from './utils/blocket/ai-utils/generateCarSearchFilters';
import { getFirstListing } from './utils/blocket/getFirstListing';
import { createUrlFromSearchFilters } from './utils/blocket/filters/createUrlFromSearchFilters';
import { BlocketAPIError } from './utils/types';
import HttpStatusCode from './utils/HttpStatusCode';
import { validateSearchQuery } from './utils/validation/validateSearchQuery';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post("/create-filters-from-query", validateSearchQuery, async (req: Request, res: Response) => {
  const { search_query } = req.body as { search_query: string };

  try {
    const result = await generateCarSearchFilters(search_query);

    if (!result) {
      const error: BlocketAPIError = {
        code: HttpStatusCode.NOT_FOUND,
        message: "Your search did not match any of the listings.",
        name: "NoMatches",
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
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});