/**
 * @fileOverview    TODO: document
 * @module          core-application
 *
 * @status          Requires documentation
 * @TODO            Write file-level and export-level docs
 */

import {auth} from "@/lib/db/auth/auth";
import {toNextJsHandler} from "better-auth/next-js";

/** TODO: document */
export const {GET, POST} = toNextJsHandler(auth);
