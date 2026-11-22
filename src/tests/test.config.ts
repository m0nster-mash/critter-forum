import nodeTest, {type TestContext, type TestOptions} from "node:test";

export type TestFn = (t: TestContext) => void | Promise<void>;

/** Registers a file's tests with consistent, deterministic numbered titles. */
export class Suite {
    private count = 0;

    constructor(
        private readonly name: string,
        private readonly total: number,
    ) {
        if (!Number.isInteger(total) || total < 1) {
            throw new RangeError("Suite total must be a positive integer.");
        }
    }

    test(testName: string, fn: TestFn): ReturnType<typeof nodeTest>;
    test(testName: string, options: TestOptions, fn: TestFn): ReturnType<typeof nodeTest>;
    test(
        testName: string,
        optionsOrFn: TestOptions | TestFn,
        maybeFn?: TestFn,
    ) {
        const index = ++this.count;
        if (index > this.total) {
            throw new Error(`Suite "${this.name}" registered more than ${this.total} tests.`);
        }

        const title = `[${this.name}: ${index}/${this.total}] ${testName}`;
        if (typeof optionsOrFn === "function") {
            return nodeTest(title, optionsOrFn);
        }
        if (!maybeFn) {
            throw new TypeError(`Suite "${this.name}" requires a test callback.`);
        }
        return nodeTest(title, optionsOrFn, maybeFn);
    }

    skipUnlessEnabled(testName: string, enabled: boolean, fn: TestFn) {
        return this.test(testName, {skip: !enabled}, fn);
    }
}
