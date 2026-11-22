/**
 * @fileOverview    Registers Next.js server instrumentation for logging unhandled request errors.
 * @module          features/auth
 */

import {LOG_EVENT_NAMES} from "@/features/alerts/constants/observability";
import {logger} from "@/features/alerts/server/logger";
import type {Instrumentation} from "next";

/**
 * Next.js hook invoked for every unhandled server error (rendering, route handlers, server actions).
 *
 * Request headers are deliberately not logged: they carry cookies and auth tokens.
 *
 * @TODO    This file is not in use; delete?
 *
 * @param   error       Thrown value or error object to inspect.
 * @param   request     Incoming request associated with the error.
 * @param   context     Optional structured data attached to this log entry.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
    logger.error(LOG_EVENT_NAMES.REQUEST_UNHANDLED_ERROR, {
        err: error,
        digest: (error as { digest?: string } | null)?.digest,
        path: request.path,
        method: request.method,
        routerKind: context.routerKind,
        routeType: context.routeType,
        routePath: context.routePath,
        renderSource: context.renderSource,
    });
};
