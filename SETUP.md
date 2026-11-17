# empty-next — Reproducible Setup Guide

A deliberately small Next.js starter using TypeScript, the App Router, Drizzle ORM, PostgreSQL, and Docker Compose.

The goal is to get a clean, repeatable development environment working. Follow the steps in order. Do not move on until the verification at the end of a step succeeds.

> **Configuration rule:** the bundled files are the starting point. Keep the existing environment-file names and settings. This guide does not ask you to redesign `.env` or `.env.example`.

## 1. What this starter contains

- Next.js App Router and React
- TypeScript and ESLint
- PostgreSQL 16 running in Docker
- Drizzle ORM and Drizzle Kit
- npm
- A minimal home page on port `3100`

### Configuration from the supplied bundle

| Setting | Value |
|---|---|
| PostgreSQL image | `postgres:16-alpine` |
| Host port | `5434` |
| Container port | `5432` |
| Database name | `project_name` |
| Database user | `project_user` |
| Database password in the supplied Compose file | `project_password` |
| Next.js development port | `3100` |
| App URL | `http://localhost:3100` |

The host port is `5434`, not `5432`. The application runs on `3100`, not Next.js's usual `3000`.

## 2. Prerequisites

Install:

- Node.js (use a current LTS release)
- npm (included with Node.js)
- Docker Desktop, or Docker Engine with the Docker Compose plugin
- Git

Verify the tools:

```bash
node --version
npm --version
docker --version
docker compose version
git --version
```

Docker must be running before you start PostgreSQL.

## 3. Create the Next.js project

From the directory where you keep your development projects, run:

```bash
npx create-next-app@latest empty-next
```

When prompted, use these choices:

| Prompt | Choice |
|---|---|
| TypeScript | Yes |
| Linter | ESLint |
| React Compiler | No |
| Tailwind CSS | No |
| Source directory (`src/`) | Yes |
| App Router | Yes |
| Customize import alias | No — keep `@/*` |
| AGENTS.md | No, if prompted |
| Cache Components | No, if prompted |

Then enter the project:

```bash
cd empty-next
```

Check that the generated project starts before adding the database:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C`.

> The generated app initially uses port `3000`. In a later step, the starter's `package.json` changes the development and production server ports to `3100`.

## 4. Apply the starter files

Use the supplied project bundle as the reference for the starter's files. The important existing files are:

```text
empty-next/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .env.example
├── .gitignore
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

Keep the supplied `.gitignore`, `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, and the `src/app` files. The bundle's `package.json` establishes these scripts and the port:

```json
{
  "scripts": {
    "dev": "next dev -p 3100",
    "build": "next build",
    "start": "next start -p 3100",
    "lint": "eslint",
    "noEmit": "npx tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push"
  }
}
```

The full `package.json` should retain the Next.js, React, ESLint, and TypeScript dependencies from the supplied bundle. The Drizzle dependencies are installed in Step 7.

## 5. Check the environment file without replacing it

The bundle includes `.env.example`. It is intentionally ignored by Git only if it is named `.env`; `.env.example` is allowed to be committed.

If you already have a correctly configured `.env`, leave it alone.

If this is a fresh local checkout and `.env` does not exist, make a local copy:

```bash
cp .env.example .env
```

Do not overwrite an existing `.env`.

The supplied example has this database URL shape:

```dotenv
DATABASE_URL=postgresql://<project_user>:<project_password>@localhost:5434/<project_name>
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3100
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

Keep the variable names and URL structure. The angle-bracketed values in the example indicate the database username, password, and database name; they are placeholders, not characters to include in a real connection URL.

### Password generation

To generate a 32-byte random hexadecimal password, use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the same actual password wherever the PostgreSQL container password and `DATABASE_URL` password are configured. Do not commit a real `.env` or a real password.

**Important detail in this bundle:** `docker-compose.yml` currently hard-codes `project_user`, `project_password`, and `project_name`; it does not read those values from `DATABASE_URL`. The password in the actual local `DATABASE_URL` must therefore match the `POSTGRES_PASSWORD` value used by Compose. The supplied bundle does not include a real `.env`, so verify this locally rather than assuming the example's placeholder is the actual password. This guide does not change your environment files.

## 6. Start PostgreSQL with Docker Compose

The supplied `docker-compose.yml` defines PostgreSQL and a persistent named volume:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "5434:5432"
    environment:
      POSTGRES_USER: project_user
      POSTGRES_PASSWORD: project_password
      POSTGRES_DB: project_name
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Keep this configuration aligned with the database URL in `.env`.

Start the database from the project root:

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

Wait for PostgreSQL to finish starting, then check readiness:

```bash
docker compose exec postgres pg_isready -U project_user -d project_name
```

Expected result:

```text
/var/run/postgresql:5432 - accepting connections
```

The database listens on port `5432` inside the container and is exposed as port `5434` on your computer. Your Next.js application connects to `localhost:5434`.

Useful commands:

```bash
# Follow database logs
docker compose logs -f postgres

# Stop the database without deleting its data
docker compose down

# Start it again later
docker compose up -d
```

Do not use `docker compose down -v` as a routine stop command. The `-v` option deletes the named database volume and its data.

## 7. Install Drizzle and the PostgreSQL driver

Use Drizzle's `node-postgres` driver:

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit tsx @types/pg
```

Why these packages:

- `drizzle-orm`: Drizzle's query builder and ORM.
- `pg`: the Node.js PostgreSQL driver.
- `dotenv`: loads `.env` for Drizzle Kit and standalone scripts.
- `drizzle-kit`: generates and applies database migrations and provides Drizzle Studio.
- `tsx`: runs TypeScript scripts without a separate compile step.
- `@types/pg`: TypeScript types for `pg`.

## 8. Add the Drizzle configuration

Create `drizzle.config.ts` in the project root:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

This tells Drizzle Kit where the schema lives, where to write migration files, which database dialect to use, and which connection URL to read.

## 9. Add an initially empty schema

Create the directory:

```bash
mkdir -p src/lib/db
```

Create `src/lib/db/schema.ts`:

```ts
// Add Drizzle table definitions to this file as the application grows.
// Keeping the schema file in place gives Drizzle Kit a stable schema path.

export {};
```

This is intentionally an empty schema. It does not create an application table. When you add your first table later, define it in this file.

## 10. Add the Drizzle database connection

Create `src/lib/db/index.ts`:

```ts
import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool });
```

This exports a Drizzle database instance for server-side application code. Do not import this module into Client Components. Database access belongs on the server.

## 11. Add a database connection check

Create `src/lib/db/check-connection.ts`:

```ts
import "dotenv/config";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const db = drizzle({ client: pool });
    await db.execute(sql`select 1`);
    console.log("Database connection successful.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database connection failed:", error);
  process.exitCode = 1;
});
```

Add this script to the `scripts` section of `package.json`:

```json
"db:check": "tsx src/lib/db/check-connection.ts"
```

Run it:

```bash
npm run db:check
```

Expected result:

```text
Database connection successful.
```

If it fails, check that Docker is running, the PostgreSQL container is ready, and the `DATABASE_URL` username, password, database name, and port match the Compose configuration.

## 12. Add the migration workflow

The supplied package scripts include:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio",
"db:push": "drizzle-kit push"
```

Use migrations as the normal workflow when you start defining tables:

1. Add or change table definitions in `src/lib/db/schema.ts`.
2. Generate a migration:

   ```bash
   npm run db:generate
   ```

3. Review the generated SQL in `drizzle/`.
4. Apply the migration:

   ```bash
   npm run db:migrate
   ```

5. Optionally open Drizzle Studio:

   ```bash
   npm run db:studio
   ```

`db:push` applies schema changes directly and is useful for quick local experiments:

```bash
npm run db:push
```

For this starter's intentionally empty schema, there may be no schema changes to generate or apply. That is expected. The connection check in Step 11 is the initial proof that the application can reach PostgreSQL through Drizzle.

## 13. Verify the Next.js application

Start the app:

```bash
npm run dev
```

Open:

[http://localhost:3100](http://localhost:3100)

The supplied home page should display:

```text
empty-next
Your Next.js starter project is ready.
```

Keep the development server running while you check the page. Stop it with `Ctrl+C`.

## 14. Run the project checks

From the project root:

```bash
npm run lint
npm run noEmit
npm run build
```

All three commands should complete without errors.

Also confirm the database is still available:

```bash
docker compose ps
npm run db:check
```

At this point, the starter has a working Next.js application, a running PostgreSQL container, a Drizzle configuration, a server-side database connection, and a repeatable migration workflow.

## 15. Suggested final project structure

After completing these steps, the relevant structure should look like:

```text
empty-next/
├── drizzle/                  # Generated migrations; appears after generation
├── public/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── db/
│           ├── check-connection.ts
│           ├── index.ts
│           └── schema.ts
├── .env                      # Local only; do not commit
├── .env.example
├── .gitignore
├── docker-compose.yml
├── drizzle.config.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 16. Save this as the reusable starter

Once every check above passes:

```bash
git status
git add .
git commit -m "Create reusable Next.js Drizzle PostgreSQL starter"
```

Check that `.env` is not staged or committed:

```bash
git status --short
```

The `.gitignore` supplied in the bundle ignores `.env` and other `.env.*` files while allowing `.env.example`.

Push the repository to your Git hosting provider when ready. For a new project, clone the starter into a new directory, follow the environment-file instructions, install dependencies with `npm install`, start PostgreSQL with `docker compose up -d`, and run `npm run dev`.

### Starting a new project from this template

A practical repeatable sequence is:

```bash
git clone <your-starter-repository-url> new-project
cd new-project
npm install
```

Then:

1. Create a local `.env` only if one is not already present; preserve the variable names and settings.
2. Confirm the database credentials in `.env` match `docker-compose.yml`.
3. Start PostgreSQL with `docker compose up -d`.
4. Check readiness with `docker compose exec postgres pg_isready -U project_user -d project_name`.
5. Check the connection with `npm run db:check`.
6. Start Next.js with `npm run dev`.
7. Rename the app metadata and homepage when you begin the new application.

**Database note:** each clone using the same Compose project name and volume name on the same Docker host may share the same Compose-managed database resources. Before running multiple clones simultaneously, give each clone a distinct Compose project name (for example, by using `docker compose -p <unique-name> up -d`) and ensure its database port does not conflict with another running clone.

---

## References

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [create-next-app CLI reference](https://nextjs.org/docs/pages/api-reference/cli/create-next-app)
- [Drizzle ORM — PostgreSQL setup](https://orm.drizzle.team/docs/get-started/postgresql-new)
- [Drizzle ORM — PostgreSQL drivers](https://orm.drizzle.team/docs/get-started-postgresql)
