# ME Technologies API Documentation

Base URL (development): `http://localhost:5000/api`
Uploaded files are served from `http://localhost:5000/uploads/<filename>`.

## 1. Conventions

- Data format: JSON. JSON field names use camelCase. Dates are ISO 8601 strings.
- Every document includes `_id`, `createdAt` and `updatedAt` (plus Mongoose's internal `__v`).
- Authentication: JWT sent as `Authorization: Bearer <token>`. The token is returned by the login endpoint and expires after the period set in `JWT_EXPIRES_IN` (default 7 days).
- There is no public registration. The admin account is created by a seed script.

### Response format

Success:
```json
{ "success": true, "data": {}, "message": "optional" }
```
Paginated list:
```json
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 9, "total": 42, "totalPages": 5 } }
```
Error:
```json
{ "success": false, "message": "Summary", "errors": [ { "field": "email", "message": "Valid email is required" } ] }
```
`errors` appears only for validation failures.

### Status codes

| Code | Meaning |
| --- | --- |
| 200 / 201 | Success / created |
| 400 | Validation failed, invalid ID, malformed JSON, bad upload |
| 401 | Missing, invalid or expired token; wrong login |
| 403 | Authenticated but not an admin |
| 404 | Resource or route not found |
| 409 | Duplicate value (slug, email) or conflict (batch full, delete blocked) |
| 500 | Unexpected server error (details are logged, never returned) |

### Pagination and filtering

List endpoints that support it accept `page` (default 1), `limit` (default 9, maximum 50), plus the filters listed below. Text search is case-insensitive and special characters are escaped.

## 2. Endpoints

Access: **Public** = no token. **Admin** = Bearer token of an admin user.

### Health and authentication

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Server status |
| POST | `/api/auth/login` | Public | Body `{ email, password }` returns `{ token, user }` |
| GET | `/api/auth/me` | Admin | Current user |

### Services

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/services` | Public | Sorted by `order`, not paginated |
| GET | `/api/services/:slug` | Public | |
| POST | `/api/services` | Admin | |
| PUT | `/api/services/:id` | Admin | Updates only the fields sent |
| DELETE | `/api/services/:id` | Admin | |

### Courses and batches

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/courses` | Public | |
| GET | `/api/courses/:slug` | Public | Includes `batches` |
| POST / PUT `/:id` / DELETE `/:id` | `/api/courses` | Admin | Delete blocked (409) while batches or enrollments exist |
| GET | `/api/batches` | Public | Filter `?course=<courseId>` |
| POST / PUT `/:id` / DELETE `/:id` | `/api/batches` | Admin | `seatsTaken` is managed by enrollments and cannot be set; delete blocked (409) while active enrollments exist |

### Enrollments

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/enrollments` | Public | Reserves a seat atomically when `batch` is given |
| GET | `/api/enrollments` | Admin | Filters `status`, `course`, `search`; `course` and `batch` are populated |
| GET | `/api/enrollments/:id` | Admin | |
| PATCH | `/api/enrollments/:id/status` | Admin | Body `{ status }`; cancelling releases the seat |
| DELETE | `/api/enrollments/:id` | Admin | Releases the seat if it was held |

### Leads (contact and quote requests)

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/leads` | Public | `status` is always set to `new` by the server |
| GET | `/api/leads` | Admin | Filters `status`, `source`, `search` |
| GET | `/api/leads/:id` | Admin | |
| PATCH | `/api/leads/:id/status` | Admin | Body `{ status }` |
| DELETE | `/api/leads/:id` | Admin | |

### Projects

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/projects` | Public | Filters `sector`, `systemType`; newest first |
| GET | `/api/projects/:slug` | Public | |
| POST / PUT `/:id` / DELETE `/:id` | `/api/projects` | Admin | |

### Blog posts

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/posts` | Public | Published only; filters `category`, `search` |
| GET | `/api/posts/:slug` | Public | Published only |
| GET | `/api/posts/admin/all` | Admin | Includes drafts; filters `category`, `search`, `isPublished` |
| POST / PUT `/:id` / DELETE `/:id` | `/api/posts` | Admin | Publishing a post without a date sets `publishedAt` automatically |

### Dashboard and uploads

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/admin/dashboard` | Admin | Counts: leads (total, new), enrollments (total, pending), posts, projects |
| POST | `/api/uploads` | Admin | `multipart/form-data`, field `image`; JPG, PNG or WebP, max 5 MB; returns `{ url }` |

## 3. Data models

| Model | Fields |
| --- | --- |
| User | `name`, `email` (unique), `passwordHash` (never returned), `role` (`admin`) |
| Service | `title`, `slug` (unique), `icon`, `shortText`, `description`, `order` |
| Course | `title`, `slug` (unique), `tools[]`, `duration`, `fee` (optional), `outline[]`, `image` |
| Batch | `course` (Course id), `startDate`, `mode` (`online`/`onsite`), `totalSeats`, `seatsTaken` |
| Enrollment | `name`, `phone`, `email`, `university`, `course`, `batch` (optional), `status` (`pending`/`confirmed`/`cancelled`) |
| Lead | `name`, `phone`, `email`, `city`, `service`, `message`, `source` (`contact`/`quote`), `status` (`new`/`contacted`/`quoted`/`closed`) |
| Project | `title`, `slug` (unique), `capacity`, `sector` (`residential`/`commercial`/`industrial`), `systemType`, `city`, `images[]`, `description`, `isSample` (default `true`) |
| Post | `title`, `slug` (unique), `category`, `coverImage`, `content`, `publishedAt`, `isPublished` (default `false`) |

Slugs are lowercase kebab-case.

## 4. Validation rules (enforced on the server)

| Field | Rule |
| --- | --- |
| name | 2-100 characters |
| email | valid format and a supported provider (list in `server/src/config/allowedEmailDomains.js`) |
| phone | 7-20 characters: digits, spaces, `+`, `-` |
| message (lead) | 10-2000 characters |
| university | 2-150 characters |
| slug | lowercase kebab-case |
| mode | `online` or `onsite` |
| totalSeats | whole number, at least 1 |

## 5. Security measures

- Passwords are hashed with bcrypt (12 rounds); only the hash is stored and it is excluded from queries by default.
- Login returns the same message for an unknown email and a wrong password, and does comparable work for both.
- JWTs are verified on every protected request and the user is re-loaded from the database.
- Admin routes use `protect` plus `adminOnly` middleware.
- Request fields are whitelisted per resource, so clients cannot set `status`, `seatsTaken` or `role`.
- All input is validated; text fields must be strings, which blocks query-operator injection.
- User search text is regex-escaped.
- Seat reservation uses a single atomic database update, so the last seat cannot be double-booked.
- Uploads: admin only, size-limited, file type checked from the file's real bytes, server-generated filenames, SVG not accepted.
- `helmet` security headers, CORS limited to `CLIENT_URL`, JSON body limited to 1 MB.
- Secrets live in `server/.env` (git-ignored); `.env.example` holds placeholders only.

## 6. Scripts and setup

| Command (run in `server/`) | Purpose |
| --- | --- |
| `npm run dev` | Start with auto-restart |
| `npm start` | Start normally |
| `npm run seed` | Add the six services and the Online Solar Design Training course (safe to rerun) |
| `npm run seed:admin` | Create the admin from `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (safe to rerun) |
| `node src/seeds/devSamples.js` / `... remove` | Add / remove clearly labelled sample projects and posts for testing |

Environment variables (`server/.env`): `NODE_ENV`, `PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## 7. Testing

Import `docs/postman/ME-Technologies-API.postman_collection.json` into Postman, create an environment with `baseUrl` (`http://localhost:5000/api`), `adminEmail`, `adminPassword` and `token`, and run "Login (saves token)" first. Folders 01-07 can be run in order with the Collection Runner; each request asserts its expected status code. Folder 08 (uploads) needs an image chosen manually.

## Projects, case studies and map (Module 3)

These endpoints replace the earlier project rows.

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/projects` | Public | Published only, paginated, newest first. Filters `sector`, `systemType`. Does not include `problem`, `solution`, `result` |
| GET | `/api/projects/map` | Public | Published projects that have coordinates, not paginated (max 500). Optional filter `sector`. Returns `_id`, `title`, `slug`, `city`, `province`, `sector`, `systemType`, `capacity`, `coverImage`, `latitude`, `longitude` |
| GET | `/api/projects/:slug` | Public | Published only, includes the full case study |
| GET | `/api/projects/admin/all` | Admin | Includes drafts. Filters `sector`, `isPublished`, `search`, `page`, `limit` |
| POST / PUT `/:id` / DELETE `/:id` | `/api/projects` | Admin | PUT updates only the fields sent; `null` clears `latitude`, `longitude`, `capacityValue`, `capacityUnit` |

**Project fields:** `title`, `slug`, `coverImage`, `images[]`, `capacity` (display text built by the server), `capacityValue`, `capacityUnit` (`kW`, `MW`, `kWh`, `MWh`), `sector` (`residential`, `commercial`, `industrial`, `agriculture`, `ev`), `systemType`, `city`, `province`, `latitude`, `longitude`, `description`, `problem`, `solution`, `result`, `isSample` (default `true`), `isPublished` (default `true`).

**Rules:**
- An unknown `sector` filter returns 400.
- `latitude` and `longitude` are sent together and must lie inside Pakistan (latitude 23.5 to 37.2, longitude 60.8 to 77.9).
- `capacityValue` and `capacityUnit` are sent together.
- `systemType` must be one of the values in `server/src/config/projectOptions.js`.
- `coverImage` and gallery entries must be an `/uploads/...` path or an http(s) URL.
- The slugs `map` and `admin` are reserved.
- Projects created before publication status existed count as published.
- Several projects can share a city, and the map endpoint returns all of them.
## Newsletter and service details

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/subscribers` | Public | Body `{ email }`, supported email providers only. 201 `Thanks for subscribing.`, 409 if already subscribed |
| GET | `/api/subscribers` | Admin | Newest first, paginated, filter `search` (email) |
| DELETE | `/api/subscribers/:id` | Admin | |

Services have an optional `included` array of strings ("What's included"). Public service responses always return `included` as an array, empty when nothing was added.