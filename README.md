# ME Technologies Website

Website for ME Technologies, an engineering consultancy and training company in Pakistan. It presents the company's services, promotes the Online Solar Design Training Program, collects enquiries and enrollments, and includes a secure admin panel. Student project ID: ET-FSD-MZK-08.

## Tech stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB with Mongoose, JWT, bcrypt, express-validator, Multer
- **Tools:** VS Code, Git and GitHub, Postman

## Project structure
- `client/` — React frontend
- `server/` — Express API
- `docs/` — project plan, API documentation and Postman collection

## Backend

### Setup
1. Install Node.js and MongoDB (local, default port 27017).
2. `cd server` then `npm install`.
3. Copy `server/.env.example` to `server/.env` and fill in every value (a long random `JWT_SECRET`, and your admin name, email and password).
4. `npm run seed` adds the six services and the solar training course.
5. `npm run seed:admin` creates the admin account from the `.env` values.
6. `npm run dev` starts the API at `http://localhost:5000`.

### Documentation and testing
- Endpoints, models, validation and security notes: [docs/api-docs.md](docs/api-docs.md)
- Postman collection: `docs/postman/ME-Technologies-API.postman_collection.json`

## Frontend

### Setup
1. `cd client` then `npm install`.
2. Copy `client/.env.example` to `client/.env`.
3. `npm run dev` starts the site at `http://localhost:5173` (the API must be running).

## AI assistance
This project was developed with guidance from two AI assistants: Claude (backend) and ChatGPT (frontend).