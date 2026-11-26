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
Admin page/action guards compose it with the existing exact permission checks. Use `requireUnverifiedAuth()` for the verification-pending page and, in later
phases, its resend and cancellation actions.

The verification-pending route is registered as `PRIVATE_ROUTES.VERIFY_EMAIL`. It is session-protected but does not
represent normal application access.

## Current implementation boundary

This phase centralizes the Next.js page and server-action session policy. It does not yet restrict direct calls to
Better Auth's browser-facing API endpoints. That API-level allowlist is the next phase and must be completed before
considering the unverified-account restriction comprehensive. Likewise, resend, cancellation, delivery tracking, and
expiration are implemented in subsequent phases.

## Checks

Run `npm run noEmit`, `npm run lint`, and `npm run test:run` after changing session guards or protected routes.
