# Permissions

Independent, per-user permissions, enforced on the server.

## Principles

1. **Permissions are defined in code and granted in the database.** `PERMISSIONS` is the canonical list of identifiers;
   `user_permission` records which user holds each permission. Adding a permission does not require a schema migration.
2. **Every permission is independent.** Nothing is inherited or implied: `admin.users.access` does not require
   `admin.access`, and neither grants `admin.users.manage`. Grant each permission explicitly.
3. **Routes declare their permission.** The `permission` property in `src/lib/constants/routes.ts` is the source of
   truth for a protected route's requirement. The page reads that value when calling the page guard.
4. **Authorize each server entry point.** A layout guard is not sufficient because layouts are not re-run for every
   navigation. Guard each protected page and each server action independently.
5. **Use one permission query.** `hasPermission(userId, permission)` checks for the exact row in `user_permission`.
   Authentication and authorization guards compose that query; they do not implement their own database lookups.

## Files

```text
src/features/admin/
  constants/alerts.ts                         registered admin authorization alerts
  permissions/
    constants/permissions.ts                  PERMISSIONS and permission definitions
    queries/has-permission.ts                 hasPermission(userId, permission)
    server/require-page-permission.ts         page guard; redirects guests and hides denied pages with notFound()
    server/require-action-permission.ts       action guard; throws a registered AlertError on denial
    types.ts                                  canonical Permission type re-export
src/features/auth/server/session.ts           getSession() and requireAuth()
src/features/alerts/registry.ts                combines feature alert registries
src/lib/db/auth/schema.ts                      user_permission table
src/lib/db/seed/seed-permissions.ts            direct grants for the development admin
```

## Recipes

### Add a permission

1. Add a stable identifier to `PERMISSIONS` in `src/features/admin/permissions/constants/permissions.ts` using the
   `area.resource.action` convention. The constant key mirrors the value:

```ts
export const PERMISSIONS = {
    ADMIN_ACCESS: "admin.access",
    ADMIN_USERS_ACCESS: "admin.users.access",
    ADMIN_USERS_MANAGE: "admin.users.manage",
    ADMIN_REPORTS_ACCESS: "admin.reports.access",
} as const;
```

2. If it protects a route, set `permission: PERMISSIONS.ADMIN_REPORTS_ACCESS` on that route's metadata in
   `src/lib/constants/routes.ts`.
3. Grant it explicitly to the users who need it. The development seed grants all defined permissions to the seeded
   development administrator.

No database migration or alert-registry change is needed for a new permission identifier. A typo in a permission
reference is a compile-time error.

### Protect a page

```tsx
export default async function ReportsPage() {
    await requirePagePermission(ADMIN_ROUTES.REPORTS.permission);
    return (/* ... */);
}
```

Call `requirePagePermission()` before rendering the page, using the permission declared on its route. Signed-out
visitors are redirected to the login page by `requireAuth()`. Signed-in users without the exact grant receive the
standard not-found page, so the protected route's existence is not revealed. Do not wrap the guard in `try/catch`:
Next.js redirect and not-found signals are control-flow errors.

### Protect a server action

A protected page does not protect its server actions; actions can be invoked independently. Call
`requireActionPermission()` inside the `safeAction()` callback:

```ts
"use server";

export const deleteThing = safeAction("things.delete", async (input: Input) => {
    const session = await requireActionPermission(PERMISSIONS.ADMIN_USERS_MANAGE);
    // Perform the operation using session.user.id and input.
    return succeed(/* serializable result */);
});
```

The action guard redirects signed-out visitors through `requireAuth()`. An authenticated user without the exact grant
causes a registered `AlertError` (`ADMIN_PERMISSION_DENIED`), which `safeAction()` converts into the normal
`ActionResult` failure. Do not catch that exception inside the action. Unexpected permission-query failures propagate
to `safeAction()` and are handled as unexpected errors; they are never converted into an authorization denial or
allowed access.

The admin denial alert is defined in `src/features/admin/constants/alerts.ts` and included in the global registry by
`src/features/alerts/registry.ts`. Keep user-facing text in that registry rather than in the guard.

### Grant or revoke

Insert or delete a row in `user_permission` (`user_id`, `permission`). Grants are checked on each request, so changes
apply immediately without requiring users to sign out.

## Notes

- Permission values are stored as text. Never rename or reuse an existing value without migrating stored rows.
- Each grant is independent. `admin.access`, `admin.users.access`, and `admin.users.manage` remain separate capabilities.
- Rows containing a permission that has since been removed from `PERMISSIONS` are no longer checked and can be deleted
  when convenient.
- The permission system does not use roles, role inheritance, or implicit administrator privileges.
- Run `npm run db:generate && npm run db:migrate` after pulling schema changes, then `npm run db:seed` for the
  development grants. Adding or changing a permission identifier alone does not require migration.

## Checks

Run `npm run test:run` to execute the permission guard, route metadata, and permission-query tests.
