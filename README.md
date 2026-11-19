# critters-forum

## Alerts

Errors, warnings and success messages all go through one system: a registry of alerts, one server logger, one browser
logger, and shared on-page components (toasts and inline banners).

See [docs/alerts.md](docs/alerts.md) for how it works, which presentation to use when, and how to add an alert.

Quick checks: `npm run alerts:check` (logic), `npm run noEmit` (types), `npm run lint` (also forbids stray `console.*`).
