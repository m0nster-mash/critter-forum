# Testing

Node's built-in runner (`node:test`) executed through `tsx`, so tests are TypeScript and use the `@/` alias.

```
npm test
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
createdb critter_test            # or any empty database
DATABASE_URL=<test url> npm run db:migrate
TEST_DATABASE_URL=<test url> npm test
```

Each test creates its own rows with unique ids and removes them afterwards; nothing else is modified. Re-run
`db:migrate` against the test database whenever the schema changes.

## Mocking modules

Tests that need to replace a module (the Next.js request APIs, the auth instance) use `mock.module` from `node:test`.
Install the mocks, then `await import(...)` the code under test, because a module imported earlier keeps its real
dependencies. The `test` script already passes `--experimental-test-module-mocks`.

## Current coverage

| File | What it covers |
|---|---|
| `permissions/permissions-constants.test.ts` | Permission values are unique, well-formed, mirrored by their keys, and pinned |
| `permissions/route-permissions.test.ts` | Every admin route declares a valid permission; `/admin` and `/admin/users` differ |
| `permissions/require-page-permission.test.ts` | Redirect, not-found, pass-through, per-user check, independence, fail-closed |
| `permissions/has-permission.integration.test.ts` | Grant, revoke, per-user, independence, duplicate rejection, cascade (real database) |
