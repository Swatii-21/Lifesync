# BloodSync Backend

Node.js + Express + MongoDB backend for the BloodSync blood donation website.

## Setup

1. Install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster instead of installing it locally).

2. Install dependencies:
   ```bash
   cd bloodsync-backend
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if your MongoDB connection string is different (e.g. an Atlas URI).

4. Start the server:
   ```bash
   npm start
   ```
   Or, for auto-restart on file changes while developing:
   ```bash
   npm run dev
   ```

5. The API will be running at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/donors` | Register a donor/acceptor (the homepage form) |
| GET | `/api/donors/search?q=` | Search donors/acceptors by name, location, or blood group |
| GET | `/api/donors/compatible/:bloodGroup` | Get donors compatible with a recipient's blood group |
| POST | `/api/subscribe` | Newsletter signup (footer form) |
| GET | `/api/stories` | Get approved success stories |
| POST | `/api/stories` | Submit a new story ("Share Your Story") |
| PATCH | `/api/stories/:id/approve` | Admin: approve a submitted story |
| GET | `/api/stats` | Get live homepage stats (active donors, lives saved, etc.) |

## Connecting the frontend

In `script.js`, the `API_BASE` constant points to `http://localhost:5000/api`.
Update this to your deployed backend URL when you host it.

## Next steps / ideas

- Add authentication (login/signup) for donors, hospitals, and admins
- Add a `Hospital` and `BloodDrive` collection for the Appointment / Nearby Blood Drive cards
- Add email/SMS notifications when a compatible donor is found for an emergency request
- Add pagination to `/api/donors/search` if the donor list grows large
