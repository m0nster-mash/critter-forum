# TypeScript type refactor

This package contains replacement contents for the seven `types.ts` / type-constant files found in project bundle version 26.

## Scope and compatibility

- Existing file paths and existing exported names are retained.
- `UserPropItems` remains as a deprecated alias of the canonical `UserSummary`.
- `AlertSeverityValue` remains as a deprecated alias of `AlertSeverity`.
- `AlertSeverity`, `AlertPresentation`, and `AlertVariant` are canonically defined alongside the alert constants and re-exported from `features/alerts/types.ts`.
- Existing consumer imports can therefore be migrated incrementally; no import rewrite is required for the compatibility aliases.

## Usage map and refactor decisions

| File | Exports | Observed consumers / intended boundary | Decision |
|---|---|---|---|
| `src/lib/types.ts` | `BreadcrumbItem`, `PageHeaderProps`, `BreadcrumbProps` | `PageHeader` and `Breadcrumbs` shared UI components | Keep shared presentation contracts together. |
| `src/lib/types.ts` | `UserSummary` (`UserPropItems` compatibility alias) | Dashboard/profile/account panels; admin user-management list/edit panels | One minimal cross-feature read-model is appropriate. It is not a DB row or auth session. |
| `src/lib/types.ts` | `DashboardPageProps`, `AccountSettingsProps`, `UserProfileProps` | Dashboard panel; account password/profile panels; profile panel | Keep distinct named component contracts despite current structural similarity; their semantics and evolution differ. |
| `src/lib/types.ts` | `UserProfilePageProps` | Profile route (`src/app/(dashboard)/profile/[userId]/page.tsx`) | Keep asynchronous Next.js route params at the route boundary; the resolved user payload is passed as `UserProfileProps`. |
| `src/features/admin/permissions/types.ts` | `Permission` re-export | Compatibility export for consumers outside this snapshot; in-repository guards, schema, routes, and tests import the canonical constant module directly | Canonical union remains in `constants/permissions.ts`; retain the re-export to avoid breaking external imports. |
| `src/features/admin/permissions/types.ts` | `UserManagementPageProps`, `UserEditPageProps` | Admin user-management and edit panels | Admin component props stay feature-local; their user payload reuses `UserSummary`. |
| `src/features/admin/permissions/types.ts` | `UserIdParams`, `AdminEditUserViewProps`, `GetSelectedUserProps` | Admin edit view and user lookup query | Keep resolved query/view contracts named and separate; shared `UserIdParams` avoids anonymous duplicates. |
| `src/features/admin/user-management/types.ts` | `AdminEditUserPageProps` | `src/app/admin/users/[userId]/edit/page.tsx` | Keep the Next.js page contract local to user-management; do not merge it with resolved view props. |
| `src/features/alerts/constants/alert-types.ts` | severity, presentation, variant constants and unions; roles and labels | Alert registry, components, toast UI/state | Canonical literal values live with their constants. |
| `src/features/alerts/types.ts` | logger, alert registry/public payload, overrides, component props, toast, context, action-result types | Alert server/client adapters, registry, components, safe actions, validation | Keep alert-domain types together; distinguish public serializable payloads from server-only diagnostics. |
| `src/features/auth/types.ts` | `AuthFlowProps`, `LogoutButtonProps`, `LogoutProps`, `RegistrationInput` | Login/registration panels, logout button, registration action and validation | Keep auth contracts feature-local. Logout button and wrapper props remain independent because their responsibilities differ. |
| `src/features/icons/types.ts` | `IconAccessibilityProps`, `IconProps`, `IconSize`, `IconVariant` | Shared icon component and icon constants | Keep icon-specific SVG and accessibility contracts together; use registry names and size constants. |

## Important follow-up

The snapshot contains both `src/features/admin/permissions/types.ts` and `src/features/admin/user-management/types.ts`. Their names overlap historically, but their responsibilities are different: permission/user-management view/query contracts versus Next.js page params. This refactor keeps both files and documents their boundaries.

The original `IconProps.name` accepts `IconName | string`; this was intentionally retained to avoid breaking dynamic callers. Tightening it to `IconName` should be a separate change after auditing those call sites.

## Verification

After copying these files into the project, run:

```sh
npm run noEmit
npm run lint
npm run test:run
npm run alerts:check
```

This full-project archive includes the replacement type files, consumer import updates, the profile-route data-flow correction, and this usage map.


## Consumer integration included in this archive

This archive is a complete snapshot of the uploaded project with the refactored type files installed and the in-repository consumers updated to match them. In particular:

- `src/app/(dashboard)/profile/[userId]/page.tsx` now awaits route params, requires an authenticated session, prevents a user from loading another user's private profile, awaits `getUserById({ userId })`, and passes the resolved user summary onward.
- `src/components/views/profile-page-view.tsx` is now a server-rendered presentation view that accepts `UserProfileProps`; it no longer calls a server database query from a client component or relies on a client session hook.
- `src/components/panels/profile-page-panel.tsx` now receives `{ user }`, matching `UserProfileProps` and its caller.
- Type-only imports throughout the project use `import type`, while runtime constants remain ordinary imports.
- Alert severity/presentation/variant unions are owned by `features/alerts/constants/alert-types.ts`; `features/alerts/types.ts` re-exports them for feature consumers.
- The existing `Permission` re-export and deprecated compatibility aliases remain available to avoid unnecessary external import breakage.

The archive contains all 143 files present in the uploaded project bundle, plus this refactor documentation. Dependency installation timed out in the packaging environment, so TypeScript, lint, and test commands could not be run here. Verify with `npm run noEmit`, `npm run lint`, `npm run test:run`, and `npm run alerts:check` in the project environment before merging.
