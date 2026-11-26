# Testing

Node's built-in runner (`node:test`) is executed through `tsx`; tests are TypeScript and use the `@/` alias.

## Quick start: isolated PostgreSQL integration tests

The test database is a separate Docker Compose service with its own port, database, and persistent volume. It is
never the development database.

```sh
# Start the dedicated test PostgreSQL service.
npm run db:test:up

# Apply the current Drizzle migrations to TEST_DATABASE_URL and create deterministic test fixtures.
npm run db:test:setup

# Run the suite. The runner explicitly uses TEST_DATABASE_URL as DATABASE_URL for the test process.
npm run db:test:run

# Destructively recreate only the test database schema, re-apply migrations, and re-seed fixtures.
npm run db:test:reset
```

Set `TEST_DATABASE_URL` in `.env` to the dedicated test database. The supplied `.env.example` points to the
`postgres-test` Compose service (`localhost:5437/critter_forum_test`). The setup, seed, run, and reset commands
refuse URLs whose database name does not end in `_test`, and refuse a URL equal to `DATABASE_URL`.

`db:test:reset` drops and recreates the `public` schema. It is intentionally limited to a database whose name ends
in `_test`; never point `TEST_DATABASE_URL` at development or production data.

## Development data

Development data remains separate:

```sh
npm run db:migrate
npm run db:seed
```

`db:seed` continues to create the existing development users and their permission grants. It does not copy, clone,
or modify the test database.

## Running tests

```sh
npm test
```

`test:run` executes all `src/tests/*/*.test.ts` files. Database integration tests are skipped unless
`TEST_DATABASE_URL` is set. To run them intentionally, use `npm run db:test:run`; this wrapper verifies the test URL
and points the test process at that URL, rather than trusting `DATABASE_URL`.

Each integration test creates its own rows with unique ids and removes them afterwards. Re-run
`npm run db:test:setup` after schema changes; it applies any pending migrations and re-creates the deterministic
fixtures without wiping the database.

## Test file layout

```
src/tests/
  test-config.ts
  <feature>/<subject>.test.ts
  <feature>/<subject>.integration.test.ts
```

Create one `Suite` per file, with the exact number of tests it registers. `Suite` throws if you register more than
`total`, which keeps the `[name: 1/5]` titles honest.

```ts
const suite = new Suite("things/validation", 2);

suite.test("rejects an empty name", () => { /* ... */ });
suite.skipUnlessEnabled("saves a thing", enabled, async () => { /* ... */ });
```

## Mocking modules

Tests that replace a module (for example, Next.js request APIs or the auth instance) use `mock.module` from
`node:test`. Install mocks, then `await import(...)` the code under test, because a module imported earlier keeps
its real dependencies. The `test:run` script passes `--experimental-test-module-mocks`.
