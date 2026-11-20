# Installing the alerts feature

1. Unzip at the project root (the folder containing `package.json`), allowing it to overwrite files.
2. Delete the two files this change replaces (zips can't delete):
   - `src/features/auth/constants/messages.ts`
   - `src/lib/constants/messages.ts`
3. `npm run noEmit && npm run lint && npm run alerts:check`
4. Optionally add the logging variables from `.env.example` to your own `.env`.
5. Delete this file.

Documentation: `docs/alerts.md`.

If `src/lib/db/check-connection.ts` (the `db:check` script) uses `console.*`, `npm run lint` will now flag it:
switch it to `logger` from `@/lib/alerts/server/logger`.
