/**
 * @fileOverview    Defines the authentication API route handler and applies the unverified-session access policy.
 * @module          core-application
 */

import {withUnverifiedAuthApiRestriction} from "@/features/auth/server/api-access";
import {auth} from "@/lib/db/auth/auth";
import {toNextJsHandler} from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

/** Restricts Better Auth GET requests for authenticated users who have not verified their email address. */
export const GET = withUnverifiedAuthApiRestriction(handlers.GET);

/** Restricts Better Auth POST requests for authenticated users who have not verified their email address. */
export const POST = withUnverifiedAuthApiRestriction(handlers.POST);
