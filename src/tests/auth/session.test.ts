/**
 * @fileOverview    Verifies shared session retrieval and authentication redirect behaviour.
 * @module          features/auth
 *
 * @remarks         Better Auth, Next.js request APIs, and React's cache are replaced with controllable doubles.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

class RedirectSignal extends Error {
    constructor(readonly url: string) {
        super(`redirect:${url}`);
    }
}

let currentSession: { user: { id: string } } | null = null;
let sessionError: Error | null = null;

mock.module("react", {
    namedExports: {cache: <T extends (...args: never[]) => unknown>(fn: T): T => fn},
});
mock.module("next/headers", {
    namedExports: {headers: async () => new Headers()},
});
mock.module("next/navigation", {
    namedExports: {
        redirect: (url: string): never => {
            throw new RedirectSignal(url);
        },
    },
});
mock.module("@/lib/db/auth/auth", {
    namedExports: {
        auth: {
            api: {
                getSession: async () => {
                    if (sessionError) throw sessionError;
                    return currentSession;
                },
            },
        },
    },
});
mock.module("@/lib/utilities/route-utils", {
    namedExports: {resolvePath: () => "/login"},
});

const {getSession, requireAuth} = await import("@/features/auth/server/session");
const suite = new Suite("auth/session", 3);

suite.test("returns the current session or null for an ordinary signed-out request", async () => {
    currentSession = {user: {id: "user-1"}};
    sessionError = null;
    assert.deepEqual(await getSession(), currentSession);

    currentSession = null;
    assert.equal(await getSession(), null);
});

suite.test("propagates unexpected Better Auth failures instead of treating them as signed out", async () => {
    const failure = new Error("auth service unavailable");
    sessionError = failure;
    await assert.rejects(() => getSession(), failure);
});

suite.test("redirects a signed-out visitor to the resolved login route", async () => {
    currentSession = null;
    sessionError = null;
    await assert.rejects(
        () => requireAuth(),
        (error) => error instanceof RedirectSignal && error.url === "/login",
    );
});
