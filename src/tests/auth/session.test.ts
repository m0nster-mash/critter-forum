/**
 * @fileOverview    Verifies shared session retrieval and verified/unverified authentication guard behaviour.
 * @module          features/auth
 *
 * @remarks         Better Auth, Next.js request APIs, route resolution, and React's cache are replaced with controllable
 *                  doubles. This suite needs no running app or database.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

class RedirectSignal extends Error {
    constructor(readonly url: string) {
        super(`redirect:${url}`);
    }
}

type SessionFixture = {user: {id: string; emailVerified: boolean}};
let currentSession: SessionFixture | null = null;
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
    namedExports: {
        resolvePath: (route: {path: string}) => route.path,
    },
});

const {getSession, requireVerifiedAuth, requireUnverifiedAuth} =
    await import("@/features/auth/server/session");
const suite = new Suite("auth/session", 8);

suite.test("returns the current session or null for an ordinary signed-out request", async () => {
    currentSession = {user: {id: "user-1", emailVerified: true}};
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

suite.test("redirects a signed-out visitor to login from the verified-auth guard", async () => {
    currentSession = null;
    sessionError = null;
    await assert.rejects(
        () => requireVerifiedAuth(),
        (error) => error instanceof RedirectSignal && error.url === PUBLIC_ROUTES.LOGIN.path,
    );
});

suite.test("redirects an unverified session to the verification-pending route", async () => {
    currentSession = {user: {id: "user-1", emailVerified: false}};
    await assert.rejects(
        () => requireVerifiedAuth(),
        (error) => error instanceof RedirectSignal && error.url === PRIVATE_ROUTES.VERIFY_EMAIL.path,
    );
});

suite.test("returns a verified session from the verified-auth guard", async () => {
    currentSession = {user: {id: "user-1", emailVerified: true}};
    assert.deepEqual(await requireVerifiedAuth(), currentSession);
});

suite.test("redirects a verified session away from the verification-pending route", async () => {
    currentSession = {user: {id: "user-1", emailVerified: true}};
    await assert.rejects(
        () => requireUnverifiedAuth(),
        (error) => error instanceof RedirectSignal && error.url === PRIVATE_ROUTES.DASHBOARD.path,
    );
});

suite.test("returns an unverified session from the unverified-auth guard", async () => {
    currentSession = {user: {id: "user-1", emailVerified: false}};
    assert.deepEqual(await requireUnverifiedAuth(), currentSession);
});

suite.test("redirects a signed-out visitor from the unverified-auth guard to login", async () => {
    currentSession = null;
    await assert.rejects(
        () => requireUnverifiedAuth(),
        (error) => error instanceof RedirectSignal && error.url === PUBLIC_ROUTES.LOGIN.path,
    );
});
