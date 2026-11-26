/**
 * @fileOverview    Verifies sign-up verification delivery is explicitly enabled and scheduled outside the response.
 * @module          features/auth
 *
 * @remarks         Better Auth, Next.js post-response work, database, logger, and provider modules are replaced with
 *                  controlled doubles; this suite does not contact external services.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {VERIFICATION_TOKEN_TTL_SECONDS} from "@/features/auth/constants/resend-policy";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

type VerificationEmailConfig = {
    sendOnSignUp?: boolean;
    expiresIn?: number;
    sendVerificationEmail: (
        input: {user: {id: string; email: string}; url: string; token: string},
        request?: Request,
    ) => Promise<void>;
};

type AuthConfig = {
    emailAndPassword: {requireEmailVerification: boolean};
    emailVerification: VerificationEmailConfig;
};

let capturedConfig: AuthConfig | undefined;
let scheduledTasks: Array<() => void | Promise<void>> = [];
let deliveries: Array<{to: string; url: string}> = [];
let loggedErrors: unknown[][] = [];
let deliveryFailure: Error | null = null;
let storedTokens: Array<{userId: string; token: string; expiresAt: Date}> = [];

mock.module("better-auth", {
    namedExports: {
        betterAuth: (config: AuthConfig) => {
            capturedConfig = config;
            return config;
        },
    },
});
mock.module("@better-auth/drizzle-adapter", {
    namedExports: {drizzleAdapter: () => ({})},
});
mock.module("@/lib/db/auth/db", {
    namedExports: {db: {}},
});
mock.module("next/server", {
    namedExports: {
        after: (task: () => void | Promise<void>) => {
            scheduledTasks.push(task);
        },
    },
});
mock.module("@/features/auth/server/verification-resend", {
    namedExports: {
        storeActiveVerificationToken: async (userId: string, token: string, expiresAt: Date) => {
            storedTokens.push({userId, token, expiresAt});
        },
    },
});
mock.module("@/features/auth/server/email", {
    namedExports: {
        sendVerificationEmail: async (to: string, url: string) => {
            deliveries.push({to, url});
            if (deliveryFailure) throw deliveryFailure;
        },
    },
});
mock.module("@/features/alerts/server/logger", {
    namedExports: {
        logger: {
            child: () => ({
                error: (...args: unknown[]) => loggedErrors.push(args),
            }),
        },
    },
});

await import("@/lib/db/auth/auth");

function reset(): void {
    scheduledTasks = [];
    deliveries = [];
    loggedErrors = [];
    deliveryFailure = null;
    storedTokens = [];
}

function getVerificationConfig(): VerificationEmailConfig {
    if (!capturedConfig) {
        throw new Error("Better Auth config should be captured during module initialization");
    }

    return capturedConfig.emailVerification;
}

const suite = new Suite("auth/verification-email", 6);

suite.test("allows unverified users to sign in with a restricted session", () => {
    assert.equal(capturedConfig?.emailAndPassword.requireEmailVerification, false);
});

suite.test("explicitly sends a verification email after every sign-up with a one-hour token lifetime", () => {
    assert.equal(getVerificationConfig().sendOnSignUp, true);
    assert.equal(getVerificationConfig().expiresIn, VERIFICATION_TOKEN_TTL_SECONDS);
});

suite.test("schedules provider delivery with Next.js after-response work", async () => {
    reset();
    await getVerificationConfig().sendVerificationEmail({
        user: {id: "user-1", email: "new-user@example.com"},
        url: "https://example.com/verify?token=test",
        token: "test-token",
    });

    assert.equal(deliveries.length, 0);
    assert.equal(scheduledTasks.length, 1);
    assert.equal(storedTokens.length, 1);
    assert.equal(storedTokens[0].token, "test-token");

    await scheduledTasks[0]();
    assert.deepEqual(deliveries, [{
        to: "new-user@example.com",
        url: "https://example.com/verify?token=test",
    }]);
});

suite.test("logs provider delivery failures inside the scheduled task", async () => {
    reset();
    deliveryFailure = new Error("provider unavailable");

    await getVerificationConfig().sendVerificationEmail({
        user: {id: "user-1", email: "new-user@example.com"},
        url: "https://example.com/verify?token=test",
        token: "test-token",
    });
    await scheduledTasks[0]();

    assert.equal(deliveries.length, 1);
    assert.equal(loggedErrors.length, 1);
});


suite.test("awaits resend delivery so provider failures are returned to the requesting user", async () => {
    reset();
    deliveryFailure = new Error("provider unavailable");
    const request = new Request("https://example.com/api/auth/send-verification-email", {method: "POST"});

    await assert.rejects(
        () => getVerificationConfig().sendVerificationEmail({
            user: {id: "user-1", email: "new-user@example.com"},
            url: "https://example.com/verify?token=resend",
            token: "resend-token",
        }, request),
        /provider unavailable/,
    );

    assert.equal(scheduledTasks.length, 0);
    assert.equal(deliveries.length, 1);
    assert.equal(storedTokens.length, 1);
    assert.equal(storedTokens[0].token, "resend-token");
    assert.equal(loggedErrors.length, 1);
});

suite.test("awaits successful resend delivery without scheduling another background task", async () => {
    reset();
    const request = new Request("https://example.com/api/auth/send-verification-email", {method: "POST"});

    await getVerificationConfig().sendVerificationEmail({
        user: {id: "user-1", email: "new-user@example.com"},
        url: "https://example.com/verify?token=resend",
        token: "resend-token",
    }, request);

    assert.equal(scheduledTasks.length, 0);
    assert.equal(deliveries.length, 1);
    assert.equal(storedTokens.length, 1);
    assert.equal(storedTokens[0].token, "resend-token");
    assert.equal(loggedErrors.length, 0);
});
