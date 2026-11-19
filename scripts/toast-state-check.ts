/**
 * Throwaway sanity check for the toast reducer. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/toast-state-check.ts
 */
import assert from "node:assert/strict";
import {createAlert} from "@/lib/alerts/create-alert";
import {MAX_VISIBLE_TOASTS, TOAST_DURATIONS, ToastItem, toastReducer} from "@/lib/alerts/client/toast-state";
import {ALERT_SEVERITIES} from "@/lib/alerts/types";

const limited = createAlert("APP_RATE_LIMITED", {params: {seconds: 5}});
const network = createAlert("APP_NETWORK_ERROR");
const unknown = createAlert("APP_UNKNOWN_ERROR");

// add
let state: ToastItem[] = [];
state = toastReducer(state, {type: "add", id: "t1", alert: limited});
assert.deepEqual(state, [{id: "t1", alert: limited, count: 1, version: 0}]);

// identical alert merges: count and version bump, original id/position kept, latest alert (new ref) wins
const withRef = {...limited, ref: "abc12345"};
state = toastReducer(state, {type: "add", id: "t2", alert: withRef});
assert.equal(state.length, 1);
assert.equal(state[0].id, "t1");
assert.equal(state[0].count, 2);
assert.equal(state[0].version, 1);
assert.equal(state[0].alert.ref, "abc12345");

// different message/code does not merge
state = toastReducer(state, {type: "add", id: "t3", alert: network});
assert.deepEqual(state.map((t) => t.id), ["t1", "t3"]);
const sameCodeOtherMessage = createAlert("APP_RATE_LIMITED", {params: {seconds: 9}});
state = toastReducer(state, {type: "add", id: "t4", alert: sameCodeOtherMessage});
assert.equal(state.length, 3, "same code with a different message is a different toast");

// stack cap: oldest dropped
state = toastReducer(state, {type: "add", id: "t5", alert: unknown});
state = toastReducer(state, {type: "add", id: "t6", alert: createAlert("APP_NOT_FOUND")});
assert.equal(state.length, MAX_VISIBLE_TOASTS);
assert.ok(!state.some((t) => t.id === "t1"), "oldest toast was dropped");
assert.equal(state[state.length - 1].id, "t6");

// dismiss / clear
state = toastReducer(state, {type: "dismiss", id: "t6"});
assert.ok(!state.some((t) => t.id === "t6"));
assert.equal(toastReducer(state, {type: "dismiss", id: "nope"}).length, state.length, "unknown id is a no-op");
assert.deepEqual(toastReducer(state, {type: "clear"}), []);

// purity: input state is never mutated
const frozen: ToastItem[] = Object.freeze([{id: "a", alert: limited, count: 1, version: 0}]) as unknown as ToastItem[];
assert.doesNotThrow(() => toastReducer(frozen, {type: "add", id: "b", alert: limited}));
assert.doesNotThrow(() => toastReducer(frozen, {type: "add", id: "c", alert: network}));

// durations: every severity has one, and failures outlast successes
for (const severity of ALERT_SEVERITIES) assert.ok(TOAST_DURATIONS[severity] > 0, severity);
assert.ok(TOAST_DURATIONS.error > TOAST_DURATIONS.success);

console.info("toast-state-check: all assertions passed");
