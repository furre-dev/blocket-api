# 🚗 Blocket Car Search API

A Node.js + TypeScript Express API that transforms plain language car search queries into Blocket car listing filter URLs, and provides a sample matching listing—all powered by AI.

## Features

- **Natural Language-to-Filters:** Send a text query (like “2018 Toyota hybrid under 200,000 SEK”), and the API uses AI to generate precise Blocket.se car search filters.
- **URL Generation:** Get shareable web & API URLs for searching Blocket cars based on your criteria.
- **Sample Listing:** Instantly retrieve an example car listing matching your query.
- **Robust Error Handling:** Clear feedback if no listings match or an error occurs.

Perfect for integrating Blocket car searches into chatbots, web apps, or automotive projects.

---

## Example API Call

```
POST /create-filters-from-query
{
  "search_query": "2019 Volvo XC60 diesel under 300,000 km"
}
```

### Example Response

```
{
  "web_url": "https://www.blocket.se/some/search-url",
  "example_listing": {
    "title": "Volvo XC60 D4 Momentum Advanced, 2019, 29000 km"
    // ...other fields
  }
}
```

---

## Getting Started

1. Install dependencies:
    ```
    npm install
    ```
2. Build the project:
    ```
    npm run build
    ```
3. Start the server:
    ```
    npm start
    ```
4. Send POST requests to `http://localhost:3001/create-filters-from-query` with your search query.

---

## Tech Stack

- Node.js
- Express
- TypeScript
- AI-powered natural language processing

---

_Easily build intelligent car search tools on top of Blocket.se!_

![mermaid](https://github.com/user-attachments/assets/e4dd8e18-ea31-4a86-b3ae-8c270b7570af)
