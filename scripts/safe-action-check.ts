/**
 * Throwaway sanity check for the server action result type and wrapper. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/safe-action-check.ts
 */
import assert from "node:assert/strict";
import {createAlert} from "@/lib/alerts/create-alert";
import {ALERT_REGISTRY, AlertCode} from "@/lib/alerts/registry";
import {ActionResult, fail, succeed} from "@/lib/alerts/result";
import {AlertError, isAlertError} from "@/features/alerts/server/alert-error";
import {safeAction} from "@/features/alerts/server/safe-action";
import {notFound, redirect} from "next/navigation";

// A success alert that logs, which the core registry doesn't have. Registered at runtime for this script only.
Object.assign(ALERT_REGISTRY, {
    TEST_SAVED: {severity: "success", message: "Saved.", presentation: "toast", log: {server: "info", client: false}},
});
const TEST_SAVED = "TEST_SAVED" as AlertCode;

// ---- capture JSON log lines
process.env.LOG_FORMAT = "json";
type Entry = Record<string, any>;
const logs: Entry[] = [];
for (const method of ["debug", "info", "warn", "error"] as const) {
    console[method] = ((line: string) => void logs.push(JSON.parse(line))) as never;
}
const first = (): Entry => logs[0];
const say = (text: string) => process.stdout.write(text + "\n");

// ---- type-level checks: inference without explicit generics
const typed = safeAction("t.typed", async (id: number, label: string) => succeed({id, label}));
const voided = safeAction("t.void", async () => succeed());
const maybe = safeAction("t.maybe", async (ok: boolean): Promise<ActionResult<{n: number}>> =>
    ok ? succeed({n: 1}) : fail(createAlert("APP_VALIDATION_FAILED")));
type Eq<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false;
const _a: Eq<Parameters<typeof typed>, [number, string]> = true;
const _b: Eq<Awaited<ReturnType<typeof voided>>["ok"], boolean> = true;
void _a; void _b;

async function main() {
    // 1. Plain success: passthrough, silent, args forwarded
    let r: ActionResult<unknown> = await typed(5, "x");
    assert.deepEqual(r, {ok: true, data: {id: 5, label: "x"}});
    assert.equal(logs.length, 0);
    assert.deepEqual(await voided(), {ok: true, data: undefined});

    // 2. Maybe-failure narrows correctly
    const m = await maybe(false);
    assert.equal(m.ok, false);
    if (!m.ok) assert.equal(m.alert.code, "APP_VALIDATION_FAILED");
    assert.equal(logs.length, 0, "validation policy is silent, so no log and no ref");
    assert.equal((m as any).alert.ref, undefined);

    // 3. Returned failure with a logging policy: logged with action name, ref stamped, same ref in log
    const limited = safeAction("t.limited", async () => fail(createAlert("APP_RATE_LIMITED", {params: {seconds: 9}})));
    r = await limited();
    assert.equal(r.ok, false);
    assert.equal(r.alert!.message, "Too many attempts. Please try again in 9 seconds.");
    assert.match(r.alert!.ref!, /^[0-9a-f]{8}$/);
    assert.equal(logs.length, 1);
    assert.equal(first().msg, "APP_RATE_LIMITED");
    assert.equal(first().action, "t.limited");
    assert.equal(first().ref, r.alert!.ref);
    logs.length = 0;

    // 4. Success alert: logged at info, NO ref (only warning/error get one), data intact
    const saved = safeAction("t.saved", async () => succeed({id: 1}, createAlert(TEST_SAVED)));
    r = await saved();
    assert.deepEqual(r, {ok: true, data: {id: 1}, alert: {code: "TEST_SAVED", severity: "success", message: "Saved.", presentation: "toast"}});
    assert.equal(logs.length, 1);
    assert.equal(first().level, "info");
    assert.ok(!("ref" in first()));
    logs.length = 0;

    // 5. Unexpected throw: generic alert + ref to the client; full detail only in the log
    const boom = safeAction("t.boom", async (password: string) => {
        void password;
        throw new Error("connection to db-internal-7 refused");
    });
    r = await boom("hunter2");
    assert.equal(r.ok, false);
    assert.equal(r.alert!.code, "APP_UNKNOWN_ERROR");
    assert.match(r.alert!.ref!, /^[0-9a-f]{8}$/);
    const wire = JSON.stringify(r);
    assert.ok(!wire.includes("db-internal-7") && !wire.includes("stack") && !wire.includes("hunter2"), "nothing internal reaches the client");
    assert.equal(logs.length, 1);
    assert.equal(first().level, "error");
    assert.equal(first().ref, r.alert!.ref);
    assert.equal(first().err.message, "connection to db-internal-7 refused");
    assert.match(first().err.stack, /db-internal-7/);
    assert.ok(!JSON.stringify(first()).includes("hunter2"), "arguments are never logged");
    logs.length = 0;

    // 6. Non-Error throwables don't break it
    r = await safeAction("t.str", async () => { throw "just a string"; })();
    assert.equal(r.ok, false);
    assert.equal(first().err, "just a string");
    logs.length = 0;

    // 7. AlertError: mapped alert (with params/field), cause + detail logged, only alert returned
    const cause = Object.assign(new Error("duplicate key"), {code: "23505"});
    const guarded = safeAction("t.guard", async () => {
        throw new AlertError("APP_RATE_LIMITED", {params: {seconds: 3}, field: "email", cause, detail: {userId: "u1"}});
    });
    r = await guarded();
    assert.equal(r.ok, false);
    assert.equal(r.alert!.message, "Too many attempts. Please try again in 3 seconds.");
    assert.equal(r.alert!.field, "email");
    assert.ok(!JSON.stringify(r).includes("duplicate key") && !JSON.stringify(r).includes("u1"));
    assert.equal(first().userId, "u1");
    assert.equal(first().err.code, "23505");
    assert.equal(first().ref, r.alert!.ref);
    logs.length = 0;

    // 8. AlertError without a cause: no stack noise in the log
    r = await safeAction("t.nocause", async () => { throw new AlertError("APP_RATE_LIMITED"); })();
    assert.equal(r.ok, false);
    assert.ok(!("err" in first()), "expected failures without a cause don't log a stack");
    logs.length = 0;

    // 9. AlertError with a silent policy: converted, not logged, no ref
    r = await safeAction("t.silent", async () => { throw new AlertError("APP_VALIDATION_FAILED"); })();
    assert.equal(r.ok, false);
    assert.equal(logs.length, 0);
    assert.equal(r.alert!.ref, undefined);

    // 10. Next control flow passes straight through, and is not logged
    await assert.rejects(safeAction("t.redirect", async () => redirect("/login"))(), (e: any) => String(e.digest).startsWith("NEXT_REDIRECT"));
    await assert.rejects(safeAction("t.notfound", async () => notFound())(), (e: any) => /NEXT_(HTTP_ERROR_FALLBACK|NOT_FOUND)/.test(String(e.digest)));
    assert.equal(logs.length, 0);

    // 11. Response whitelist: stray keys on a returned result are stripped
    r = await safeAction("t.strip", async () => ({ok: true, data: 1, secret: "x"} as any))();
    assert.deepEqual(r, {ok: true, data: 1});

    // 12. Results survive a JSON round trip (what crossing the boundary requires)
    r = await limited();
    assert.deepEqual(JSON.parse(JSON.stringify(r)), r);
    logs.length = 0;

    // 13. isAlertError
    assert.equal(isAlertError(new AlertError("APP_UNKNOWN_ERROR")), true);
    assert.equal(isAlertError(new Error("x")), false);
    assert.equal(isAlertError({isAlertError: true}), false);

    say("safe-action-check: all assertions passed");
}

main().catch((e) => { say(String(e?.stack ?? e)); process.exit(1); });
