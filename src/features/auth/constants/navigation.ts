/**
 @fileOverview    Provides the navigation functionality used by the application.
 @module          features/auth
 */

import {PUBLIC_ROUTES} from "@/lib/constants/routes";

/** Default destination after an authentication flow returns the user to the public application. */
export const AUTH_REDIRECT = PUBLIC_ROUTES.HOME.path;
