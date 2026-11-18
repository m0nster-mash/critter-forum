# critters-forum

## Alert architecture

Alerts are defined centrally in `src/lib/alerts/registry.ts`.

Use `createAlert()` to create a serializable `PublicAlert`. Do not construct alert objects manually when a registry code exists.

Server actions should return `ActionResult<T>` and use `safeAction()` so unexpected errors are logged on the server and safe messages are returned to the client.

## Which presentation should I use?

| Presentation | Use when | Example |
|---|---|---|
| `inline` | The user needs to see an error in the context of the current page or form. | Invalid form data, failed login |
| `toast` | The message is temporary and does not need to block the user's current task. | Successful registration, background operation completed |
| `none` | The event is useful for logging but does not need user-facing presentation. | Internal diagnostic event |

Severity and presentation are separate decisions. An error can be inline or a toast depending on the interaction.

## Authentication alert routing

| Event | Registry code | Presentation |
|---|---|---|
| Registration succeeds | `AUTH_REGISTER_SUCCESS` | Toast |
| Registration validation fails | `AUTH_REGISTER_INVALID` | Inline |
| Registration fails | `AUTH_REGISTER_FAILED` | Inline |
| Automatic sign-in after registration fails | `AUTH_REGISTER_SIGNIN_FAILED` | Inline |
| Login fails | `AUTH_LOGIN_FAILED` | Inline |
| Logout fails | `AUTH_LOGOUT_FAILED` | Toast |
| Unexpected application error | `APP_UNKNOWN_ERROR` | Toast or error boundary |

## Logging

- Server logging is implemented in `src/lib/alerts/server/logger.ts`.
- Client logging is implemented in `src/lib/alerts/client/logger.ts`.
- Alert log policy is configured in the alert registry.
- Production client logging is restricted to sanitized warning and error records.
- Do not log passwords, tokens, cookies, or other credentials.
- Use the `ref` on an alert to correlate a user-facing error with its server log entry.

Set `NEXT_PUBLIC_ALERT_LOG_LEVEL` to `debug`, `info`, `warn`, `error`, or `silent` to control client logging during development.

## Error handling

- Use `safeAction()` for server actions.
- Use `AlertError` for expected failures raised by deeper server-side helpers.
- Use `AlertBanner` for persistent inline feedback.
- Use `useAlert().notify(alert)` for toast notifications.
- Next.js route errors are handled by `src/app/error.tsx`.
- Root-level errors are handled by `src/app/global-error.tsx`.
- Unmatched routes are handled by `src/app/not-found.tsx`.

## Route reference

| Route | Path |
|---|---|
| Home | `/` |
| Login | `/login` |
| Registration | `/register` |
| Dashboard | `/dashboard` |
| Admin dashboard | `/admin` |
