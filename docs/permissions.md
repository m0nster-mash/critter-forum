# Permissions

Independent, per-user permissions, enforced on the server.

## Principles

1. **Permissions are defined in code, granted in the database.** `PERMISSIONS` is the single list of what exists;
   the `user_permission` table only records who holds what. Adding a permission needs no migration.
2. **Every permission is independent.** Nothing is inherited or implied: `admin.users.access` does not need
   `admin.access`, and vice versa. Grant each one explicitly.
3. **Routes declare their permission.** `permission` on a route in `lib/constants/routes.ts` is the one place a
   route's requirement is written; the page reads it from there.
4. **Check on the server, in the page.** Layouts are not re-run when navigating between pages that share them, so a
   layout guard can be skipped. Guard each page (and each action) itself.

## Files

```
src/features/permissions/
  constants/permissions.ts          PERMISSIONS (every permission identifier)
  types.ts                          Permission (union of the values)
  server/has-permission.ts          hasPermission(userId, permission) -> boolean
  server/require-page-permission.ts requirePagePermission(permission) for pages
src/lib/db/auth/schema.ts           user_permission table
src/lib/db/seed/seed-permissions.ts grants permissions to the dev admin
```

## Recipes

### Add a permission

1. Add it to `PERMISSIONS` (`area.resource.action`, key mirrors the value):

```ts
export const PERMISSIONS = {
    ADMIN_ACCESS: "admin.access",
    ADMIN_USERS_ACCESS: "admin.users.access",
    ADMIN_REPORTS_ACCESS: "admin.reports.access",
} as const;
```

2. If it protects a route, set `permission: PERMISSIONS.ADMIN_REPORTS_ACCESS` on that route's metadata.
3. Grant it (the seeded admin receives every permission automatically in development).

No migration, no registry change. A typo or a missing `permission` on a route is a compile error.

### Protect a page

```tsx
export default async function ReportsPage() {
    await requirePagePermission(ADMIN_ROUTES.REPORTS.permission);
    return (/* ... */);
}
```

Signed-out visitors go to the login page. Signed-in users without the permission get the standard not-found page, so
the route's existence is not revealed. Do not wrap the call in `try/catch` (it uses Next.js control-flow errors).

### Protect a server action

Pages being guarded does not protect actions, which are callable on their own. Check inside the action and throw a
registered alert (see `docs/alerts.md`):

```ts
export const deleteThing = safeAction("things.delete", async (input: Input) => {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session || !(await hasPermission(session.user.id, PERMISSIONS.THINGS_DELETE))) {
        throw new AlertError("THINGS_DELETE_DENIED");   // define it in the feature's constants/alerts.ts
    }
    // ...
});
```

If several actions need this, promote it to a shared `requireActionPermission` next to `requirePagePermission`.

### Grant or revoke

Insert or delete a row in `user_permission` (`user_id`, `permission`). Grants are checked on every request, so changes
apply immediately, with no sign-out needed.

## Notes

- `permission` values are stored as text. Never rename one without migrating the stored rows.
- Rows holding a permission that was later removed from `PERMISSIONS` are ignored (nothing asks for them) and can be
  deleted at leisure.
- Run `npm run db:generate && npm run db:migrate` after pulling this change, then `npm run db:seed` for the dev admin.
