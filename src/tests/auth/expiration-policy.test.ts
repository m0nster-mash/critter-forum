/** @fileOverview Tests the pending-registration expiration policy. */

import {
    DEFAULT_UNVERIFIED_ACCOUNT_TTL_DAYS,
    getUnverifiedAccountExpirationCutoff,
    getUnverifiedAccountTtlDays,
} from "@/features/auth/constants/expiration-policy";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("auth/expiration-policy", 7);

suite.test("defaults to a seven-day pending-registration lifetime", () => {
    assert.equal(getUnverifiedAccountTtlDays(undefined), DEFAULT_UNVERIFIED_ACCOUNT_TTL_DAYS);
});

suite.test("accepts a configured positive integer", () => {
    assert.equal(getUnverifiedAccountTtlDays("14"), 14);
});

suite.test("rejects zero", () => {
    assert.throws(() => getUnverifiedAccountTtlDays("0"), /must be an integer/);
});

suite.test("rejects negative values", () => {
    assert.throws(() => getUnverifiedAccountTtlDays("-2"), /must be an integer/);
});

suite.test("rejects fractional values", () => {
    assert.throws(() => getUnverifiedAccountTtlDays("2.5"), /must be an integer/);
});

suite.test("rejects values above the supported maximum", () => {
    assert.throws(() => getUnverifiedAccountTtlDays("366"), /must be an integer/);
});

suite.test("computes a precise cutoff from the supplied clock", () => {
    const now = new Date("2026-11-26T12:00:00.000Z");
    assert.equal(
        getUnverifiedAccountExpirationCutoff(now, 7).toISOString(),
        "2026-11-19T12:00:00.000Z",
    );
});
