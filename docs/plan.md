# ME Technologies Website — Project Plan

## 1. Project Overview

ME Technologies is an engineering consultancy and training company. The website has two main business goals:

1. Generate consulting enquiries and quote requests.
2. Attract students to the Online Solar Design Training Program.

**Tagline:** Smart Engineering Today. Sustainable Tomorrow.

**Contact:** 0316 6379325

## 2. Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt
- Validation: express-validator
- Image uploads: Multer
- API testing: Postman
- Version control: Git and GitHub

## 3. Sitemap

- Home — `/`
- About — `/about`
- Services — `/services`
  - Electrical Engineering
  - Solar PV
  - Battery Energy Storage Systems (BESS)
  - EV Charging
  - Architecture and Building Design
  - Civil and Structural Engineering
- EV Charging — `/ev-charging`
- Training — `/training`
- Course details — `/training/:slug`
- Projects — `/projects`
- Project details — `/projects/:slug`
- Blog — `/blog`
- Blog article — `/blog/:slug`
- Contact — `/contact`
- Get a Quote — `/quote`
- Admin login and protected panel — `/admin`

## 4. Database Schema

### users
`name`, `email`, `passwordHash`, `role`

### services
`title`, `slug`, `icon`, `shortText`, `description`, `order`

### courses
`title`, `slug`, `tools`, `duration`, `fee`, `outline`, `image`

### batches
`course`, `startDate`, `mode`, `totalSeats`, `seatsTaken`

### enrollments
`name`, `phone`, `email`, `university`, `course`, `batch`, `status`

### projects
`title`, `slug`, `capacity`, `sector`, `systemType`, `city`, `images`, `description`

### posts
`title`, `slug`, `category`, `coverImage`, `content`, `publishedAt`

### leads
`name`, `phone`, `email`, `city`, `service`, `message`, `source`, `status`

## 5. Proposed API Endpoints

These are the planned REST routes; implementation may refine the exact endpoints.

- Authentication: `POST /api/auth/login`, `GET /api/auth/me`
- Services: `GET /api/services`, `GET /api/services/:slug`, and protected admin CRUD routes
- Courses and batches: public listing/detail routes and protected admin CRUD routes
- Projects: listing, detail, sector filtering, and protected admin CRUD routes
- Blog: listing, detail, search, pagination, and protected admin CRUD routes
- Leads: `POST /api/leads`, admin listing, detail and status updates
- Enrollments: `POST /api/enrollments`, admin listing and status management
- Dashboard: `GET /api/admin/dashboard`
- Images: protected image-upload endpoint

## 6. Homepage Wireframe

1. Top contact bar with phone, email and social links
2. Sticky navigation with logo, main tabs and Get a Quote button
3. Hero with tagline, Get a Quote and View Training actions
4. Animated impact counters
5. Six consulting service cards
6. How We Work process steps
7. EV Charging feature section
8. Solar Design Training highlight
9. Latest three blog posts
10. Engineering software and tools strip
11. Final call-to-action band
12. Footer with contact information, links and newsletter

A floating WhatsApp button appears throughout the public site.

## 7. Admin Panel

- Secure login and logout
- Dashboard counts for leads, enrollments, posts and projects
- CRUD for services, courses, batches, projects and blog posts
- Lead and enrollment tables with search, filters and status management
- Image upload support

## 8. Brand and Content Research

- Collect the official logo and brand colors from the company profile.
- Use approved brand colors as centralized CSS variables.
- Use one Google Font for headings and another for body text.
- Collect real company service and course details from the official social pages.
- Clearly label demonstration projects and sample team members.
- Do not fabricate real clients, testimonials, staff credentials or course fees.

## 9. Advanced Module

**Assignment status:** Pending supervisor confirmation.

The assigned module will be added to the architecture and implementation plan after confirmation.

## 10. Day 1 Deliverables

- GitHub repository and initial commits
- React frontend and Express backend foundations
- Project sitemap and database schema plan
- Proposed API endpoint list
- Homepage wireframe
- Official logo assets, selected brand colors and font system