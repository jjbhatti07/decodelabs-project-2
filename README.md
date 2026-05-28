# Project 2: Database Integration (CRUD)
Built with Node.js, Express.js and SQLite for DecodeLabs Industrial Training 2026.

## How to Run
1. Install dependencies
   npm install

2. Start the server
   npm start

3. Server runs on http://localhost:3000

## API Endpoints

| Method | Route      | Description       | Status Code |
|--------|------------|-------------------|-------------|
| GET    | /users     | Get all users     | 200         |
| GET    | /users/:id | Get user by ID    | 200         |
| POST   | /users     | Create new user   | 201         |
| PUT    | /users/:id | Update user       | 200         |
| DELETE | /users/:id | Delete user       | 204         |

## Status Codes
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 409 Conflict (Duplicate email)

## Tech Stack
- Node.js
- Express.js
- SQLite (better-sqlite3)