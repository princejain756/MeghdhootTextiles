# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b09a0513-8085-46e0-bdf6-098c384950ac

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b09a0513-8085-46e0-bdf6-098c384950ac) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

The admin and customer portals are backed by a dedicated Express + Prisma API that persists data to PostgreSQL.

## Running the app locally

### Backend (Express + Prisma + PostgreSQL)

You can run the DB either with your own PostgreSQL, or with Docker (recommended for quick start).

#### Option A: Dockerized PostgreSQL (recommended)

1. Start the DB:
   - From project root: `docker compose up -d db`
2. Setup the server env:
   - `cp server/.env.example server/.env`
   - Update `JWT_SECRET` to a long random string (>= 32 chars)
3. Install deps and generate Prisma client:
   - `cd server && npm install && npm run prisma:generate`
4. Create schema and seed admin user:
   - `npm run prisma:migrate -- --name init`
   - `npm run prisma:seed`
5. Start the API:
   - `npm run dev`

> The DB is exposed at `localhost:6545` (db: `meghdoot`, user: `meghdoot`, password: `meghdoot`).

#### Option B: Existing PostgreSQL

1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and point `DATABASE_URL` to your database; set `JWT_SECRET` and `CLIENT_ORIGIN`.
4. `npm run prisma:generate`
5. `npm run prisma:migrate` (create the schema in your PostgreSQL database)
6. `npm run prisma:seed` (creates the default `admin` user with password `AdminMegh1412@4`)
7. `npm run dev`

> The API listens on `http://localhost:5000` by default. Update `CLIENT_ORIGIN` (e.g. `http://localhost:5173`) to enable cookie-based auth during local development.

### Frontend (Vite + React)

1. From the project root, `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` (e.g. `http://localhost:5000/api`)
3. `npm run dev`

## Admin credentials

The seed script provisions an administrator:

- Username: `admin`
- Email: `admin@meghdoot.com`
- Password: `AdminMegh1412@4`

Admin users can manage products, view every order, respond to support tickets, and update delivery information. Registered trade partners get a tailored dashboard for orders, delivery timelines, and support conversations.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b09a0513-8085-46e0-bdf6-098c384950ac) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
# MeghdhootTextiles
