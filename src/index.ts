import express, { Request, Response } from 'express';
import cors from "cors"
import { generateCarSearchFilters } from './utils/blocket/ai-utils/generateCarSearchFilters';
import { getFirstListing } from './utils/blocket/getFirstListing';
import { createUrlFromSearchFilters } from './utils/blocket/filters/createUrlFromSearchFilters';
import { BlocketAPIError } from './utils/types';
import HttpStatusCode from './utils/HttpStatusCode';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post("/create-filters-from-query", async (req: Request, res: Response) => {
  const body: { search_query?: string } | undefined = req.body;

  if (!body || !body.search_query) {
    const error: BlocketAPIError = {
      code: HttpStatusCode.BAD_REQUEST,
      message: "Missing search_query",
      name: "MissingSearchQuery"
    }
    res.status(error.code).json({ error: error });
    return;
  }

  try {
    const result = await generateCarSearchFilters(body.search_query);

    if (!result) {
      res.status(404).json({ error: "Your search did not match any of the listings." });
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

    res.json(responseObject);
    return;
  } catch (error) {
    const catchedError = error as Error;

    const err: BlocketAPIError = {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: catchedError.message,
      name: catchedError.name
    }

    res.status(err.code).json({ error: err });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});