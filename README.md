# 🚗 Blocket Car Search API

A Node.js + TypeScript Express API that transforms plain language car search queries into Blocket car listing filter URLs, provides a sample matching listing—all powered by AI—and includes session authentication, advanced input validation, and Redis caching.

## Features

- **Natural Language-to-Filters:** Send a text query (like “2018 Toyota hybrid under 200,000 SEK”), and the API uses AI to generate precise Blocket.se car search filters.
- **URL Generation:** Get shareable web & API URLs for searching Blocket cars based on your criteria.
- **Sample Listing:** Instantly retrieve an example car listing matching your query.
- **Session Authentication:** Maintains user sessions for secure, personalized use.
- **API Input Validation:** Uses an `isValidCarSearch` API layer to ensure queries are well-formed and helpful errors are returned otherwise.
- **Redis Caching:** Utilizes Redis for session store.
- **Robust Error Handling:** Clear feedback if no listings match or an error occurs.

Perfect for integrating Blocket car searches into chatbots, web apps, or automotive projects.

---

## Example API Call

```bash
POST /create-filters-from-query
```
```json
{
  "search_query": "2019 Volvo XC60 diesel under 300,000 km"
}
```

### Example Response

```json
{
  "web_url": "https://www.blocket.se/some/search-url",
  "example_listing": {
    "title": "Volvo XC60 D4 Momentum Advanced, 2019, 29000 km"
  }
}
```

---

## Authentication & Sessions

This API uses session-based authentication.

1. **Session creation example**
   ```bash
   POST /create-session
   ```
   - On success, a session cookie is returned to the client.

2. **Session Management**
   - Sessions are securely managed.
   - Endpoints like `/create-filters-from-query` require a valid session cookie.

---

## Input Validation: isValidCarSearch API Layer

Before processing, all incoming search queries are validated by the `isValidCarSearch` middleware/API layer:
- Ensures the `search_query` field exists, is a string, and meets a minimum requirement.
- Returns clear errors for missing, too short, or nonsensical queries.

**Input**
```json
{
  "search_query": "Hej hur mår du?"
}
```
```json
{
  "error": {
  "feedback": "Jag mår bra tack! Men jag är här för att hjälpa dig hitta rätt bil. Skriv gärna vad du letar efter så visar jag några förslag."
  }
}
```

---

## Redis Integration

- The API caches query results in Redis for performance.
- On a repeated query:
  - If cached, returns instantly from Redis.
  - If not, processes and saves to Redis.
- Requires a running Redis instance (default: localhost:6379). See your `.env` or config for custom settings.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Build the project:**
   ```bash
   npm run build
   ```
3. **Start Redis server (if not already running):**
   ```bash
   redis-server
   ```
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Send POST requests to** `http://localhost:3001/create-filters-from-query` **with your search query and session cookie.**

---

## Tech Stack

- Node.js
- Express
- TypeScript
- Redis (for caching)
- AI-powered (natural language understanding)

---

## Example Workflow

1. **Load page to receive a session cookie**
2. **Send an authenticated POST request to `/create-filters-from-query` with a search query**
3. **Query is validated by `isValidCarSearch`**
5. **AI processes the query, response is generated, cached, and returned**

---

_Easily build intelligent, authenticated & efficient car search tools on top of Blocket.se!_

## API Architecture Sequence Diagram

![mermaid](https://github.com/user-attachments/assets/49c87fc1-d84d-42da-a96d-46076308bc57)
