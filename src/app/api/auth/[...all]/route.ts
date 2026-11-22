/**
 * @fileOverview    Defines the authentication API route handler.
 * @module          core-application
 */

import {auth} from "@/lib/db/auth/auth";
import {toNextJsHandler} from "better-auth/next-js";

/** Defines the authentication API route handler. */
export const {GET, POST} = toNextJsHandler(auth);
