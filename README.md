# empty-next

A reusable Next.js starter with TypeScript, the App Router, Drizzle ORM, PostgreSQL, and Docker Compose.

This repository is intended to be cloned as the starting point for new projects. It provides a minimal working application and a local PostgreSQL development database.

## Tech Stack

- Next.js and React
- TypeScript
- Next.js App Router
- ESLint
- Drizzle ORM and Drizzle Kit
- PostgreSQL 16
- Docker Compose
- npm

## Requirements

Install the following before using the repository:

- Node.js (current LTS recommended) and npm
- Docker Desktop, or Docker Engine with the Docker Compose plugin
- Git

Check that the tools are available:

```bash
node --version
npm --version
docker --version
docker compose version
git --version
````

Docker must be running before you start the database.

## **1. Clone the repository**

Replace the placeholder URL with the URL of your `empty-next` repository:

```
git clone <your-empty-next-repository-url> my-new-project
cd my-new-project
```

`my-new-project` is the local directory name. It does not automatically change the database name, database user, package name, or application metadata.

## **2. Install dependencies**

If the repository contains a committed `package-lock.json`, use:

```
npm ci
```

Otherwise, use:

```
npm install
```

## **3. Configure environment variables**

The repository includes `.env.example`. Create `.env` from it only if you do not already have a local `.env`:

```
cp .env.example .env
```

**Do not overwrite an existing&#x20;**`.env`**. Do not commit&#x20;**`.env`**.**

The environment variable names and URL structure used by this starter are:

```
DATABASE_URL=postgresql://<project_user>:<project_password>@localhost:5434/<project_name>
BETTER_AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3100
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

- Keep these variable names. 
- Replace the database URL placeholders with the actual database username, password, and database name configured for this project. 
- Do not include the angle brackets.

Generate a strong random hexadecimal password with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The PostgreSQL password configured in `docker-compose.yml` must match the password in `DATABASE_URL`. The database name and user in the URL must also match the Compose configuration.

The supplied Compose configuration currently uses:

| Setting          | Value                |
| ---------------- | -------------------- |
| Database         | `project_name`       |
| User             | `project_user`       |
| Password         | `project_password`   |
| PostgreSQL image | `postgres:16-alpine` |
| Host port        | `5434`               |
| Container port   | `5432`               |

The Compose file currently defines these database values directly. If you choose a different password, update the Compose password and the local `DATABASE_URL` so they agree. Keep real credentials out of Git.

## **4. Start PostgreSQL**

From the repository root, run:

```
docker compose up -d
```

Check that the container is running:

```
docker compose ps
```

Check that PostgreSQL is ready:

```
docker compose exec postgres pg_isready -U project_user -d project_name
```

A successful readiness check reports that PostgreSQL is accepting connections.

The database is exposed to your computer on `localhost:5434`. Port `5432` is the port inside the container.

Useful database commands:

```
# View database logs
docker compose logs -f postgres

# Stop the container without deleting database data
docker compose down

# Start it again
docker compose up -d
```

Avoid `docker compose down -v` unless you deliberately want to delete the database volume and all data stored in it.

## **5. Check the database connection**

If the starter includes the `db:check` script, run:

```
npm run db:check
```

It should report:

```
Database connection successful.
```

If the command fails, verify that Docker is running, PostgreSQL is ready, and the credentials and port in `DATABASE_URL` match `docker-compose.yml`.

## **6. Run the application**

Start the Next.js development server:

```
npm run dev
```

Open [http://localhost:3100](http://localhost:3100?utm_source=chatgpt.com).

Stop the development server with `Ctrl+C`.

## **7. Database development with Drizzle**

The starter's Drizzle configuration uses:

- Schema: `src/lib/db/schema.ts`
- Migrations directory: `drizzle/`
- Database URL: `DATABASE_URL` from `.env`

When you add or change tables in the schema, use this migration workflow:

```
# Generate migration files from schema changes
npm run db:generate

# Review the generated SQL in drizzle/
# Apply migrations to the database
npm run db:migrate
```

Other available commands:

```
# Open Drizzle Studio
npm run db:studio

# Push schema changes directly (primarily useful for local experimentation)
npm run db:push
```

For normal project development, prefer generating and reviewing migrations before applying them.

## **8. Run project checks**

From the repository root:

```
npm run lint
npm run noEmit
npm run build
```

These commands run ESLint, TypeScript checking, and a production build.

## **9. Start another project from this template**

For each new project:

1. Clone the repository into a new directory.
2. Install dependencies.
3. Create a local `.env` if one does not already exist.
4. Set the database URL to match the database configuration in `docker-compose.yml`.
5. Start PostgreSQL.
6. Check the database connection.
7. Start Next.js.
8. Update the package name, page content, metadata, and other project-specific details as needed.

### **Running multiple clones on one computer**

Docker Compose uses a project name to group containers and volumes. By default, that name is based on the directory name, so distinct clone directories normally receive distinct Compose project names.

However, this starter maps PostgreSQL to the fixed host port `5434`. Two clones cannot both bind that same host port at the same time. If you need to run multiple clones concurrently, assign a different host port to each clone in its `docker-compose.yml`, and update that clone's `DATABASE_URL` to use the matching port.

Each Compose project should also have its own database volume. Do not deliberately reuse a Compose project name if you want separate databases.

## **Important notes**

- `.env` contains local configuration and secrets; never commit it.
- `.env.example` is the shareable template. Keep it free of real secrets.
- The PostgreSQL data is stored in a Docker named volume and persists when you run `docker compose down`.
- `docker compose down -v` deletes that volume and its database contents.
- The starter is intentionally minimal. Add application features, database tables, and seed data as the new project requires.

## **Useful references**

- [Next.js documentation](https://nextjs.org/docs?utm_source=chatgpt.com)
- [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview?utm_source=chatgpt.com)
- [Drizzle PostgreSQL setup](https://orm.drizzle.team/docs/get-started/postgresql-new?utm_source=chatgpt.com)
- [Docker Compose documentation](https://docs.docker.com/compose/?utm_source=chatgpt.com)
  
