
/**
 * @fileOverview    Exposes the canonical permission union for the admin permission system.
 * @module          features/admin/permissions
 */

/**
 * Canonical permission union used by the admin permission system.
 *
 * @remarks     Re-exported from the permissions constants module to provide a feature-level import path.
 *
 * @see         {@link requirePagePermission} in `src/features/admin/permissions/server/require-page-permission.ts`
 */
export type {Permission} from "@/features/admin/permissions/constants/permissions";
