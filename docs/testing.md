# Testing

Node's built-in runner (`node:test`) is executed through `tsx`; tests are TypeScript and use the `@/` alias.

## Quick start: isolated PostgreSQL integration tests

The test database is a separate Docker Compose service with its own port, database, and persistent volume. It is
never the development database. The normal `npm run test:run` command is intentionally pinned to this isolated test
database; it refuses to run when `TEST_DATABASE_URL` is missing or does not end in `_test`.

```sh
# Start the dedicated test PostgreSQL service.
npm run db:test:up

# Apply the current Drizzle migrations to TEST_DATABASE_URL and create deterministic test fixtures.
npm run db:test:setup

# Run the complete suite with DATABASE_URL pinned to TEST_DATABASE_URL.
npm run test:run

# Destructively recreate only the test database schema, re-apply migrations, and re-seed fixtures.
npm run db:test:reset
```

`npm run db:test:run` remains available as an explicit alias for `npm run test:run`.

## Integration test coverage

Database integration tests are skipped when `TEST_DATABASE_URL` is not configured. When enabled, they verify:

- Permission grant reads, independence, revocation, uniqueness, and user-delete cascades.
- Pending-registration cancellation, including deletion of sessions, credentials, permissions, resend state, revoked
  token hashes, and email verification records.
- Refusal to cancel a verified account.
- Expired unverified-account cleanup and preservation of verified or not-yet-expired accounts.

Each integration test creates uniquely identified rows and cleans them up afterwards. Use only the dedicated test
PostgreSQL database; never point `TEST_DATABASE_URL` at development or production data.

## Test runner escape hatch

`npm run test:run:unsafe` invokes the raw Node test runner without validating or overriding `DATABASE_URL`. It exists
for specialized debugging only. Prefer `npm run test:run`; the safe command validates `TEST_DATABASE_URL` and pins the
child process to it, preventing database tests from accidentally connecting to the development database.
