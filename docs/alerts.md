# Alerts

One way to handle errors, warnings and successes, across three destinations:

| Destination | Where | What it gets |
|---|---|---|
| Terminal / server logs | server | Full detail: stack, cause chain, context. Private. |
| Browser console | client | Sanitized in production (the console is public). |
| On-page | client | A user-safe message, as a **toast** or an **inline** banner. |

## Principles

1. **An alert is data.** A plain, serializable `PublicAlert` (`code`, `severity`, `message`, `presentation`, optional
   `field` and `ref`). It crosses the server/client boundary; internal detail never does.
2. **Text lives in the registry, not at call sites.** There is deliberately no way to pass a free-form message. Dynamic
   values go through `params` (`"... at least {min} characters"`). This is what stops raw error strings reaching users.
3. **The registry decides presentation and logging**, so no component decides how an alert looks.
4. **Log where it originates.** The server logs what the server saw; the client logs only what it uniquely knows.
5. **A `ref` on screen always matches a server log line.** It is only stamped when a warning or error is actually logged.

## Which presentation

| Situation | Presentation | Server log | Browser console (prod) |
|---|---|---|---|
| Success of a completed action | toast | `info` if meaningful | none |
| Validation problem | inline (field or form) | none | none |
| Expected failure (bad credentials, email taken) | inline | none / `warn` | none |
| Warning about content on screen | inline | optional | none |
| Warning not tied to an element | toast | optional | `warn` |
| Network failure | toast | none | `warn` |
| Unexpected error | toast (action) or error boundary (page) | `error`, full detail + ref | `error`, sanitized + ref |

## Files

```
src/features/alerts/
  types.ts, registry.ts, create-alert.ts, result.ts      shared and pure
  error-digest.ts, from-thrown.ts                        shared helpers
  server/  logger.ts, log-alert.ts, safe-action.ts, alert-error.ts, ref.ts
  client/  logger.ts, log-alert.ts, provider.tsx, use-alerts.ts,
           toast-state.ts, global-error-listeners.ts
  components/  alert-banner.tsx, toast-viewport.tsx, alert-icon.tsx, etc.
  styles/      alerts.module.css
src/app/                error.tsx, global-error.tsx, not-found.tsx, layout.tsx (mounts <AlertProvider>)
src/instrumentation.ts  logs unhandled server errors
src/features/<feature>/constants/alerts.ts   each feature's registry entries
```

## Recipes

### Add an alert

In the feature's `constants/alerts.ts` (for example, `../src/features/auth/constants/alerts.ts` or
`../src/features/admin/constants/alerts.ts`), then spread it into `ALERT_REGISTRY` in
`src/features/alerts/registry.ts`:

```ts
export const THINGS_ALERTS = {
    THINGS_SAVED: {
        severity: "success",
        message: "Saved.",
        presentation: "toast",
        log: {server: "info", client: false},
    },
} as const satisfies Record<string, AlertDefinition>;
```

Name codes `FEATURE_ACTION_REASON`. The prefix is what keeps spread registries from colliding. Set `field` on an
alert that belongs to a form field, and `log: {server: false, client: false}` for routine expected outcomes.

### Server action

```ts
"use server";

export const saveThing = safeAction("things.save", async (input: Input) => {
    const invalid = validate(input);
    if (invalid) return fail(invalid);              // expected failure: return it
    await requireAuth();                            // redirects signed-out visitors; safeAction preserves the redirect
    const thing = await db.insert(/* ... */);       // unexpected failures: just let them throw
    return succeed(thing, createAlert("THINGS_SAVED"));
});
```

`safeAction` always resolves to an `ActionResult` and never throws to the client. It logs per the registry, stamps a
`ref`, turns unexpected errors into a generic alert, lets `redirect()`/`notFound()` through, and never logs arguments.
Use `throw new AlertError("CODE", {cause, detail, params})` for an expected failure raised deep in a helper.
Keep `data` serializable.

### Component

```tsx
const {present, clear, formAlert, fieldAlert} = useAlerts();

async function onSubmit() {
    clear();
    const result = await saveThing(input);
    if (!result.ok) return present(result.alert);   // routed by the registry: toast, inline, or log-only
    present(result.alert ?? createAlert("THINGS_SAVED"));
}

<AlertBanner alert={formAlert}/>                                      // form-level
<input aria-invalid={fieldAlert("name") ? true : undefined} aria-describedby="name-alert"/>
<AlertBanner alert={fieldAlert("name")} id="name-alert" variant="field"/>
```

Wrap awaited calls in `try/catch` and `present(alertFromThrown(err), {err})` for network and unexpected failures.
Validation shared by form and server action lives in one pure function (see `features/auth/validation.ts`).

### Logging

Use the loggers; `console.*` is a lint error everywhere else.

```ts
import {logger} from "@/features/alerts/server/logger";    // server
logger.child({scope: "seed"}).info("Created user.", {email});

import {clientLogger} from "@/features/alerts/client/logger"; // browser
```

The server logger redacts values under keys like `password`, `token`, `secret`, `authorization`, `cookie`, `apiKey`,
and removes bound query parameters from database error messages. Pass errors as `{err}`.

## Environment

| Variable | Values | Default |
|---|---|---|
| `LOG_LEVEL` | `debug` `info` `warn` `error` | `debug` dev, `info` prod |
| `LOG_FORMAT` | `pretty` `json` | `pretty` dev, `json` prod |
| `NEXT_PUBLIC_LOG_LEVEL` | `debug` `info` `warn` `error` | `debug` dev, `warn` prod |

`NEXT_PUBLIC_LOG_LEVEL` controls how much the browser logs, never how much detail: detail is development-only.

## Behaviour worth knowing

- **Toasts**: stack of 4 (oldest dropped); identical alerts merge into one toast with a count; success 4s, info 5s,
  warning 8s, error 12s; hover or focus pauses the timer; Escape dismisses. Errors and warnings use `role="alert"`,
  success and info `role="status"`. Severity is shown by icon and a screen-reader label, never color alone.
- **Provider** lives in the root layout, so a toast raised before `router.push()` still shows after navigation.
- **Error boundaries**: `error.tsx` (inside the layout) and `global-error-display.tsx` (when the layout itself fails) show a
  generic alert with Next's `digest` as the reference; it matches the `request.unhandled_error` server log entry.
- **Global listeners** turn uncaught errors and unhandled promise rejections into the same generic toast, ignoring
  browser-extension and cross-origin noise.

## Known limits

- A server-side `redirect()` loses a pending toast (the toast state is in the browser). Current flows redirect on the
  client, so this doesn't arise. If it does, a short-lived flash cookie is the fix.
- The browser prints uncaught errors to its own console natively; that output is outside this system's control.
- One inline alert per `useAlerts()` hook at a time; a form reports the first validation problem only.
- Messages are single-language strings in the registry.

## Checks

`npm run alerts:check` runs the logic checks in `scripts/`. They are plain `tsx` scripts with no test runner needed.
