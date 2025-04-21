import express, { Request, Response } from 'express';
import cors from "cors"
import { generateCarSearchFilters } from './utils/blocket/ai-utils/generateCarSearchFilters';
import { getFirstListing } from './utils/blocket/getFirstListing';
import { createUrlFromSearchFilters } from './utils/blocket/filters/createUrlFromSearchFilters';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post("/create-filters-from-query", async (req: Request, res: Response) => {
  const body: { search_query?: string } = req.body;

  if (!body.search_query) {
    res.status(400).json({ error: "Missing search_query" });
    return;
  }

  try {
    const result = await generateCarSearchFilters(body.search_query);

    if (!result) {
      res.status(404).json({ error: "Your search did not match any of the listings." });
      return;
    }

    const { api_url, web_url } = createUrlFromSearchFilters(result);

    const { car, error } = await getFirstListing(api_url);

    if (error) {
      res.status(error.code).json({ error: error.message });
      return;
    }

    const responseObject = {
      web_url: web_url,
      example_listing: car
    }

    res.json(responseObject);
    return;
  } catch (error) {
    const err = error as {
      message: string
    }

    res.status(500).json({ error: "Internal server error", message: err.message });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});