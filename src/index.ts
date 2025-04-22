import express, { Request, Response } from 'express';
import cors from "cors"
import { generateCarSearchFilters } from './utils/blocket/ai-utils/generateCarSearchFilters';
import { getFirstListing } from './utils/blocket/getFirstListing';
import { createUrlFromSearchFilters } from './utils/blocket/filters/createUrlFromSearchFilters';
import { BlocketAPIError } from './utils/types';
import HttpStatusCode from './utils/HttpStatusCode';
import { validateSearchQuery } from './utils/validation/validateSearchQuery';
import { connectToRedisClient } from './utils/redis/connectToRedisClient';
import { redisMiddleware } from './utils/redis/redisMiddleware';
import { createSession } from './utils/redis/utils/createSession';
import { defaultCatchError } from './utils/createError';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/create-session", async (req: Request, res: Response) => {
  try {
    const newSession = await createSession();
    res.json({ token: newSession })
  } catch (error) {
    const catchError = defaultCatchError(error)
    res.status(catchError.code).json({ error: catchError })
  }
})

app.post("/create-filters-from-query", redisMiddleware, validateSearchQuery, async (req: Request, res: Response) => {
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
});

async function startServer() {
  try {
    await connectToRedisClient();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to Redis or start the server.", error);
    process.exit(1);
  }
}

startServer();
