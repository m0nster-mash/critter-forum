/**
 * @fileOverview    Verifies sign-up verification delivery is explicitly enabled and scheduled outside the response.
 * @module          features/auth
 *
 * @remarks         Better Auth, Next.js post-response work, database, logger, and provider modules are replaced with
 *                  controlled doubles; this suite does not contact external services.
 * @remarks         Requires `--experimental-test-module-mocks` (set in the `test:run` script).
 */

import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";

type VerificationEmailConfig = {
    sendOnSignUp?: boolean;
    sendVerificationEmail: (input: {user: {email: string}; url: string}) => Promise<void>;
};

type AuthConfig = {emailVerification: VerificationEmailConfig};

let capturedConfig: AuthConfig | undefined;
let scheduledTasks: Array<() => void | Promise<void>> = [];
let deliveries: Array<{to: string; url: string}> = [];
let loggedErrors: unknown[][] = [];
let deliveryFailure: Error | null = null;

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
}

function getVerificationConfig(): VerificationEmailConfig {
    assert.ok(capturedConfig, "Better Auth config should be captured during module initialization");
    return capturedConfig.emailVerification;
}

const suite = new Suite("auth/verification-email", 3);

suite.test("explicitly sends a verification email after every sign-up", () => {
    assert.equal(getVerificationConfig().sendOnSignUp, true);
});

suite.test("schedules provider delivery with Next.js after-response work", async () => {
    reset();
    await getVerificationConfig().sendVerificationEmail({
        user: {email: "new-user@example.com"},
        url: "https://example.com/verify?token=test",
    });

    assert.equal(deliveries.length, 0);
    assert.equal(scheduledTasks.length, 1);

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
        user: {email: "new-user@example.com"},
        url: "https://example.com/verify?token=test",
    });
    await scheduledTasks[0]();

    assert.equal(deliveries.length, 1);
    assert.equal(loggedErrors.length, 1);
});
