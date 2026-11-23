/**
 * @fileOverview Verifies toast reducer merging, capacity, dismissal, and timing constants.
 * @module features/alerts
 */
import {toastReducer} from "@/features/alerts/client/toast-state";
import {ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {MAX_VISIBLE_TOASTS, TOAST_ACTION_TYPES, TOAST_DURATIONS} from "@/features/alerts/constants/toast";
import {createAlert} from "@/features/alerts/create-alert";
import type {ToastItem} from "@/features/alerts/types";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("alerts/toast-state", 6);
const limited = createAlert("APP_RATE_LIMITED", {params: {seconds: 5}});
const network = createAlert("APP_NETWORK_ERROR");
const unknown = createAlert("APP_UNKNOWN_ERROR");

suite.test("adds a toast with its initial count and version", () => {
    const state = toastReducer([], {type: TOAST_ACTION_TYPES.ADD, id: "t1", alert: limited});
    assert.deepEqual(state, [{id: "t1", alert: limited, count: 1, version: 0}]);
});

suite.test("merges identical alerts while retaining identity and updating the latest alert", () => {
    let state = toastReducer([], {type: TOAST_ACTION_TYPES.ADD, id: "t1", alert: limited});
    state = toastReducer(state, {type: TOAST_ACTION_TYPES.ADD, id: "t2", alert: {...limited, ref: "abc12345"}});
    assert.equal(state.length, 1);
    assert.equal(state[0].id, "t1");
    assert.equal(state[0].count, 2);
    assert.equal(state[0].version, 1);
    assert.equal(state[0].alert.ref, "abc12345");
});

suite.test("different messages or codes remain separate toasts", () => {
    let state = toastReducer([], {type: TOAST_ACTION_TYPES.ADD, id: "t1", alert: limited});
    state = toastReducer(state, {type: TOAST_ACTION_TYPES.ADD, id: "t2", alert: network});
    state = toastReducer(state, {
        type: TOAST_ACTION_TYPES.ADD,
        id: "t3",
        alert: createAlert("APP_RATE_LIMITED", {params: {seconds: 9}})
    });
    assert.equal(state.length, 3);
});

suite.test("the stack cap drops the oldest toast", () => {
    const alerts = [
        unknown,
        network,
        createAlert("APP_RATE_LIMITED", {params: {seconds: 5}}),
        createAlert("APP_RATE_LIMITED", {params: {seconds: 6}}),
        createAlert("APP_RATE_LIMITED", {params: {seconds: 7}}),
    ];

    let state: ToastItem[] = [];

    for (let index = 0; index < alerts.length; index++) {
        state = toastReducer(state, {
            type: TOAST_ACTION_TYPES.ADD,
            id: `t${index + 1}`,
            alert: alerts[index],
        });
    }

    assert.equal(state.length, MAX_VISIBLE_TOASTS);
    assert.ok(!state.some((item) => item.id === "t1"), "oldest toast was dropped");
    assert.equal(state.at(-1)?.id, "t5");
});

suite.test("dismiss, unknown-id dismissal, and clear behave correctly", () => {
    let state = toastReducer([{id: "t1", alert: limited, count: 1, version: 0}],
        {type: TOAST_ACTION_TYPES.DISMISS, id: "t1"});
    assert.deepEqual(state, []);
    state = [{id: "t1", alert: limited, count: 1, version: 0}];
    assert.deepEqual(toastReducer(state, {type: TOAST_ACTION_TYPES.DISMISS, id: "missing"}), state);
    assert.deepEqual(toastReducer(state, {type: TOAST_ACTION_TYPES.CLEAR}), []);
});

suite.test("reducer does not mutate frozen input and every severity has a duration", () => {
    const frozen = Object.freeze([{id: "a", alert: limited, count: 1, version: 0}]) as unknown as ToastItem[];
    assert.doesNotThrow(() => toastReducer(frozen, {type: TOAST_ACTION_TYPES.ADD, id: "b", alert: limited}));
    assert.doesNotThrow(() => toastReducer(frozen, {type: TOAST_ACTION_TYPES.ADD, id: "c", alert: network}));
    for (const severity of ALERT_SEVERITIES) assert.ok(TOAST_DURATIONS[severity] > 0, severity);
    assert.ok(TOAST_DURATIONS.error > TOAST_DURATIONS.success);
});
