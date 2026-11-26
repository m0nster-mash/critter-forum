# Testing

Node's built-in runner (`node:test`) executed through `tsx`, so tests are TypeScript and use the `@/` alias.

```
npm run test:run
```

## Layout

```
tests/
  test-config.ts                         Suite: numbered, deterministic test titles
  <feature>/<subject>.test.ts            pure and mocked tests, always run
  <feature>/<subject>.integration.test.ts  need a database, skipped unless TEST_DATABASE_URL is set
```

## Writing a test file

Create one `Suite` per file, with the exact number of tests it registers. `Suite` throws if you register more than
`total`, which keeps the `[name: 1/5]` titles honest.

```ts
const suite = new Suite("things/validation", 2);

suite.test("rejects an empty name", () => { /* ... */ });
suite.skipUnlessEnabled("saves a thing", enabled, async () => { /* ... */ });
```

## Database tests

They run only when `TEST_DATABASE_URL` is set, and they refuse to touch `DATABASE_URL`. Use a separate database:

```
docker compose up -d --wait
docker compose exec postgres createdb -U critter_user critter_forum_test
export TEST_DATABASE_URL=postgresql://critter_user:critter_password@localhost:5436/critter_forum_test
DATABASE_URL="$TEST_DATABASE_URL" npm run db:migrate
npm run test:run
```

Each test creates its own rows with unique ids and removes them afterwards; nothing else is modified. Re-run
`db:migrate` against the test database whenever the schema changes.

## Mocking modules

Tests that need to replace a module (the Next.js request APIs, the auth instance) use `mock.module` from `node:test`.
Install the mocks, then `await import(...)` the code under test, because a module imported earlier keeps its real
dependencies. The `test:run` script already passes `--experimental-test-module-mocks`.

## Current coverage

| File | What it covers |
|---|---|
| `permissions/permissions-constants.test.ts` | Permission values are unique, well-formed, mirrored by their keys, and pinned |
| `permissions/route-permissions.test.ts` | Every admin route declares a valid permission; `/admin` and `/admin/users` differ |
| `permissions/require-page-permission.test.ts` | Redirect, not-found, pass-through, per-user check, independence, fail-closed |
| `permissions/has-permission.integration.test.ts` | Grant, revoke, per-user, independence, duplicate rejection, cascade (real database) |
| `routes/page-guards.test.ts` | Server-side authentication and permission guards run at each protected route entry point |
| `admin/user-update.test.ts` | Admin edit permission, normalized name-only updates, validation, and missing-user handling |
| `auth/verification-email.test.ts` | Sign-up verification is enabled, delivery is scheduled after the response, and provider failures are logged |
| `users/user-validation.test.ts` | Profile-name, email-address, and password-change form validation |
