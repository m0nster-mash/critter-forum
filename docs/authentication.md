# Authentication and email verification

## Authentication states

Critter Forum distinguishes a valid Better Auth session from permission to use the application. Email verification is
an application access requirement, not a prerequisite for creating a session.

| State | Access |
|---|---|
| Signed out | Public routes and sign-in/registration |
| Authenticated, email unverified | Verification-pending page only |
| Authenticated, email verified | Normal application routes, subject to their existing permissions |

Better Auth's `emailAndPassword.requireEmailVerification` must remain disabled (the current default). Enabling it
prevents an unverified user from signing in, which would prevent the verification-pending workflow from using an
ordinary authenticated session.

## Shared server guards

`src/features/auth/server/session.ts` owns the session and verification-state policy:

- `getSession()` retrieves the current session or returns `null`.
- An internal `requireSession()` helper requires a session but does not decide whether its email is verified. It is
  deliberately not exported; application code should use one of the explicit verification-state guards.
- `requireVerifiedAuth()` requires a session with `user.emailVerified === true`. Signed-out users are redirected to
  login; unverified users are redirected to `/verify-email`.
- `requireUnverifiedAuth()` requires a session with `user.emailVerified === false`. Signed-out users are redirected to
  login; verified users are redirected to the dashboard.

Use `requireVerifiedAuth()` for private pages and protected server actions. This includes the temporary alert-test page.
Admin page/action guards compose it with the existing exact permission checks. Use `requireUnverifiedAuth()` for the verification-pending page and its future resend and cancellation actions.

The verification-pending route is registered as `PRIVATE_ROUTES.VERIFY_EMAIL`. It is session-protected but does not
represent normal application access.

## Better Auth API restriction

`src/features/auth/server/api-access.ts` wraps both handlers exported by the Better Auth Next.js route. Before delegating
an incoming request, it reads the current session using the request headers. Ordinary signed-out requests and verified
sessions are passed through unchanged. The resend endpoint is an exception: it requires an unverified session and only
accepts that session's own email address. An authenticated unverified session may call only these Better Auth endpoints:

- `/get-session` to keep the verification-pending UI informed of its session state;
- `/sign-out` to leave the restricted session;
- `/send-verification-email` to request another verification message;
- `/verify-email` to complete the verification link flow.

Every other Better Auth API endpoint is rejected with HTTP 403 and the stable `EMAIL_NOT_VERIFIED` error code. This
includes account/profile changes and password changes. The allowlist is centralized in
`src/features/auth/constants/api.ts`; add an endpoint only when its use by an unverified account is intentional and
covered by tests. Better Auth's own endpoint validation still applies to every allowed request.

This restriction is applied at the Next.js HTTP route boundary, so it covers direct browser-facing calls to
`/api/auth/*`, not only calls made through the application's client components. Server-side application operations must
continue to use the verified-session guards from the previous section.

## Verification-email resend

The verification-pending page lets the signed-in user request another message through Better Auth's
`/send-verification-email` endpoint. The API route wrapper verifies that the request is authenticated, belongs to the
current user's own email address, and is still unverified before reserving an attempt.

Resend policy is centralized in `src/features/auth/constants/resend-policy.ts`:

- 60-second cooldown between resend requests;
- maximum of five resend attempts in a 24-hour window beginning with the first resend request;
- verification links expire after one hour.

Attempt state is persisted in `email_verification_resend` and updated under a PostgreSQL row lock. Provider failures
consume an attempt, preventing repeated failed delivery calls from bypassing the limit. The API returns HTTP 429 and a
`Retry-After` header when a request is blocked. The page displays a countdown and a clear success/failure message.

Sign-up email delivery continues to use Next.js `after()` so provider latency does not delay account creation. Resend
requests await the provider call so a failure can be returned to the pending page. Provider errors are logged under the
existing `auth.email` logger scope. A newly generated token stores only a SHA-256 hash; the previous token hash is moved to
`revoked_verification_token`, and the API rejects a replaced link before Better Auth verifies it. Token state is updated
before provider delivery so a later resend remains the active link even if concurrent provider requests finish out of
order. Raw tokens are not persisted.

## Pending-registration cancellation

The `/verify-email` page also offers cancellation for a user who decides not to complete registration. The browser
must submit the current password to `POST /api/auth/cancel-registration`. The endpoint requires a same-origin `Origin`
header, an active unverified session, and a successful Better Auth `verifyPassword` check. It never accepts a user ID or
email from the browser; the account is derived from the authenticated session.

Deletion runs in a database transaction. It locks and rechecks the user row and refuses to delete an account whose
email has become verified. The `user` row is then deleted, cascading to its Better Auth sessions and credential
accounts, direct permissions, resend state, and revoked verification-token hashes. Better Auth verification records
for the user's email are explicitly deleted because the verification table does not have a user foreign key. The
successful response is returned only after the transaction commits, so the deleted session is no longer valid.

The cancellation endpoint is separate from the Better Auth catch-all API route. This keeps cancellation out of the
normal Better Auth endpoint allowlist while still allowing a password-confirmed operation from the unverified page.
Verified users are rejected before password verification and the transactional deletion helper independently checks
verification state to protect against a verification/cancellation race.

### Database migration

Phase 3 adds `email_verification_resend` and `revoked_verification_token`. Generate and apply that schema migration
before deploying the updated application:

```bash
npm run db:generate
npm run db:migrate
```

## Expiration and cleanup of abandoned registrations

Unverified registrations expire after seven days by default. The retention period is configured with
`UNVERIFIED_ACCOUNT_TTL_DAYS` (an integer from 1 through 365); the cutoff is calculated from the account's
`user.created_at` timestamp. The cleanup selects only users whose `email_verified` value is still false and whose
creation timestamp is strictly earlier than the cutoff. Verified accounts are never candidates.

A scheduled worker must call `GET /api/cron/cleanup-unverified-accounts` with
`Authorization: Bearer <CRON_SECRET>`. The endpoint rejects requests without the configured secret. Set `CRON_SECRET`
to a long random value and keep it private; do not expose it through a `NEXT_PUBLIC_` variable. If it is unset, the
endpoint remains inaccessible.

Each invocation processes at most 500 accounts in one database transaction. Candidate user rows are locked with
`SKIP LOCKED`, then verification records keyed by their email are deleted and the user rows are deleted with the
unverified/expiry conditions rechecked. User foreign-key cascades remove sessions, credentials, direct permissions,
resend state, and revoked token hashes. If the response contains `hasMore: true`, invoke the endpoint again until it
returns false. Schedule the job daily; a frequent schedule is also safe because the operation is idempotent and bounded.

Example manual invocation:

```bash
curl --fail-with-body \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://your-app.example.com/api/cron/cleanup-unverified-accounts
```

The response includes the number deleted, whether another batch remains, and the cutoff timestamp. Successful runs and
failures are recorded under the `auth.maintenance` server log scope. Changing the retention period affects future
cleanup runs; it does not change account creation timestamps or immediately delete records until the scheduled endpoint
runs.

### Environment configuration

```dotenv
CRON_SECRET=<long-random-secret>
UNVERIFIED_ACCOUNT_TTL_DAYS=7
```

No database migration is required for this phase; it uses the existing Better Auth user and verification tables.


## Checks

Run `npm run noEmit`, `npm run lint`, and `npm run test:run` after changing session guards, protected routes, cancellation, or scheduled cleanup. The test command requires `TEST_DATABASE_URL` and always pins database access to the isolated test database; see [Testing](testing.md) for setup and integration coverage.
