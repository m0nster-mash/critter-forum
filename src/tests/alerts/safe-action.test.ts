/**
 * @fileOverview    Verifies safe server-action results, error handling, logging, and Next control flow.
 * @remarks         Next navigation functions are mocked before importing the action wrapper.
 * @module          features/alerts
 */

/* eslint-disable no-console -- These tests intentionally intercept console methods to verify logger output. */
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";
import {mock} from "node:test";
import {ALERT_REGISTRY, type AlertCode} from "@/features/alerts/registry";

class NavigationSignal extends Error {
    constructor(readonly digest: string) { super(digest); }
}
mock.module("next/navigation", {
    namedExports: {
        redirect: (url: string): never => {
            throw new NavigationSignal(`NEXT_REDIRECT;${url}`);
        },
        notFound: (): never => {
            throw new NavigationSignal("NEXT_HTTP_ERROR_FALLBACK;404");
        },
        unstable_rethrow: (error: unknown): void => {
            if (error instanceof NavigationSignal) {
                throw error;
            }
        },
    },
});

const {createAlert} = await import("@/features/alerts/create-alert");
const {fail, succeed} = await import("@/features/alerts/result");
const {AlertError, isAlertError} = await import("@/features/alerts/server/alert-error");
const {safeAction} = await import("@/features/alerts/server/safe-action");
const {notFound, redirect} = await import("next/navigation");
const suite = new Suite("alerts/safe-action", 13);

Object.assign(ALERT_REGISTRY, {
    TEST_SAVED: {severity: "success", message: "Saved.", presentation: "toast", log: {server: "info", client: false}},
});
const TEST_SAVED = "TEST_SAVED" as AlertCode;
type LogEntry = Record<string, unknown>;

function withCapturedLogs<T>(fn: (logs: LogEntry[]) => Promise<T>): Promise<T> {
    return (async () => {
        const saved = {...process.env};
        const originals = Object.fromEntries(["debug", "info", "warn", "error"].map((method) =>
            [method, console[method as "debug" | "info" | "warn" | "error"]]));
        const logs: LogEntry[] = [];
        process.env.LOG_FORMAT = "json";
        for (const method of ["debug", "info", "warn", "error"] as const) {
            console[method] = ((line: string) => { logs.push(JSON.parse(line)); }) as never;
        }
        try { return await fn(logs); }
        finally {
            for (const method of ["debug", "info", "warn", "error"] as const) console[method] = originals[method] as never;
            for (const key of ["LOG_FORMAT"]) {
                if (saved[key] === undefined) delete process.env[key];
                else process.env[key] = saved[key]!;
            }
        }
    })();
}

suite.test("plain success passes data through silently and forwards typed arguments", async () => {
    await withCapturedLogs(async (logs) => {
        const typed = safeAction("t.typed", async (id: number, label: string) => succeed({id, label}));
        const voided = safeAction("t.void", async () => succeed());
        assert.deepEqual(await typed(5, "x"), {ok: true, data: {id: 5, label: "x"}});
        assert.deepEqual(await voided(), {ok: true, data: undefined});
        assert.equal(logs.length, 0);
    });
});

suite.test("returned validation failures narrow correctly and remain unlogged", async () => {
    await withCapturedLogs(async (logs) => {
        const maybe = safeAction("t.maybe", async (ok: boolean) =>
            ok ? succeed({n: 1}) : fail(createAlert("APP_VALIDATION_FAILED")));
        const result = await maybe(false);
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.alert.code, "APP_VALIDATION_FAILED");
        assert.equal(logs.length, 0);
    });
});

suite.test("logged returned failures receive a reference shared with the log", async () => {
    await withCapturedLogs(async (logs) => {
        const limited = safeAction("t.limited", async () => fail(createAlert("APP_RATE_LIMITED", {params: {seconds: 9}})));
        const result = await limited();
        assert.equal(result.ok, false);
        if (result.ok) return;
        assert.equal(result.alert.message, "Too many attempts. Please try again in 9 seconds.");
        assert.match(result.alert.ref!, /^[0-9a-f]{8}$/);
        assert.equal(logs.length, 1);
        assert.equal(logs[0].msg, "APP_RATE_LIMITED");
        assert.equal(logs[0].action, "t.limited");
        assert.equal(logs[0].ref, result.alert.ref);
    });
});

suite.test("success alerts log at info without adding a reference", async () => {
    await withCapturedLogs(async (logs) => {
        const saved = safeAction("t.saved", async () => succeed({id: 1}, createAlert(TEST_SAVED)));
        assert.deepEqual(await saved(), {ok: true, data: {id: 1}, alert: {
            code: "TEST_SAVED", severity: "success", message: "Saved.", presentation: "toast",
        }});
        assert.equal(logs.length, 1);
        assert.equal(logs[0].level, "info");
        assert.ok(!("ref" in logs[0]));
    });
});

suite.test("unexpected errors return a generic alert and keep details only in the server log", async () => {
    await withCapturedLogs(async (logs) => {
        const boom = safeAction("t.boom", async (password: string) => {
            void password;
            throw new Error("connection to db-internal-7 refused");
        });
        const result = await boom("hunter2");
        assert.equal(result.ok, false);
        if (result.ok) return;
        assert.equal(result.alert.code, "APP_UNKNOWN_ERROR");
        assert.match(result.alert.ref!, /^[0-9a-f]{8}$/);
        assert.ok(!JSON.stringify(result).includes("db-internal-7"));
        assert.ok(!JSON.stringify(result).includes("hunter2"));
        assert.equal(logs[0].level, "error");
        assert.equal(logs[0].ref, result.alert.ref);
        assert.equal((logs[0].err as Record<string, unknown>).message, "connection to db-internal-7 refused");
        assert.ok(!JSON.stringify(logs[0]).includes("hunter2"));
    });
});

suite.test("non-Error throwables are converted without crashing", async () => {
    await withCapturedLogs(async (logs) => {
        const result = await safeAction("t.str", async () => { throw "just a string"; })();
        assert.equal(result.ok, false);
        assert.equal(logs[0].err, "just a string");
    });
});

suite.test("AlertError maps its alert and logs cause plus structured detail", async () => {
    await withCapturedLogs(async (logs) => {
        const cause = Object.assign(new Error("duplicate key"), {code: "23505"});
        const guarded = safeAction("t.guard", async () => {
            throw new AlertError("APP_RATE_LIMITED", {params: {seconds: 3}, field: "email", cause, detail: {userId: "u1"}});
        });
        const result = await guarded();
        assert.equal(result.ok, false);
        if (result.ok) return;
        assert.equal(result.alert.message, "Too many attempts. Please try again in 3 seconds.");
        assert.equal(result.alert.field, "email");
        assert.ok(!JSON.stringify(result).includes("duplicate key"));
        assert.ok(!JSON.stringify(result).includes("u1"));
        assert.equal(logs[0].userId, "u1");
        assert.equal((logs[0].err as Record<string, unknown>).code, "23505");
        assert.equal(logs[0].ref, result.alert.ref);
    });
});

suite.test("AlertError without a cause does not add stack noise", async () => {
    await withCapturedLogs(async (logs) => {
        const result = await safeAction("t.nocause", async () => { throw new AlertError("APP_RATE_LIMITED"); })();
        assert.equal(result.ok, false);
        assert.ok(!("err" in logs[0]));
    });
});

suite.test("silent AlertError failures are converted without logging or a reference", async () => {
    await withCapturedLogs(async (logs) => {
        const result = await safeAction("t.silent", async () => { throw new AlertError("APP_VALIDATION_FAILED"); })();
        assert.equal(result.ok, false);
        if (result.ok) return;
        assert.equal(logs.length, 0);
        assert.equal(result.alert.ref, undefined);
    });
});

suite.test("Next redirect control flow passes through and is not logged", async () => {
    await withCapturedLogs(async (logs) => {
        await assert.rejects(safeAction("t.redirect", async () => redirect("/login"))(),
            (error: unknown) => error instanceof NavigationSignal && error.digest.startsWith("NEXT_REDIRECT"));
        assert.equal(logs.length, 0);
    });
});

suite.test("Next not-found control flow passes through and is not logged", async () => {
    await withCapturedLogs(async (logs) => {
        await assert.rejects(safeAction("t.notfound", async () => notFound())(),
            (error: unknown) => error instanceof NavigationSignal && /NEXT_HTTP_ERROR_FALLBACK/.test(error.digest));
        assert.equal(logs.length, 0);
    });
});

suite.test("returned action results are whitelisted before crossing the boundary", async () => {
    await withCapturedLogs(async () => {
        const unsafe = safeAction("t.strip", async () => ({ok: true, data: 1, secret: "x"} as never));
        assert.deepEqual(await unsafe(), {ok: true, data: 1});
    });
});

suite.test("results survive JSON serialization and AlertError detection is nominal", async () => {
    await withCapturedLogs(async (logs) => {
        const limited = safeAction("t.limited", async () => fail(createAlert("APP_RATE_LIMITED")));
        const result = await limited();
        assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
        assert.equal(isAlertError(new AlertError("APP_UNKNOWN_ERROR")), true);
        assert.equal(isAlertError(new Error("x")), false);
        assert.equal(isAlertError({isAlertError: true}), false);
        logs.length = 0;
    });
});
