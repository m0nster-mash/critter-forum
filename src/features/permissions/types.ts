/**
 * @fileOverview    Defines shared types for the permission system.
 * @module          features/permissions
 */

import type {PERMISSIONS} from "@/features/permissions/constants/permissions";

/** Union of every permission identifier that can be granted to a user. */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
