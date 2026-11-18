/**
 * TODO:: document
 */
export type ActionResult<T extends object = Record<never, never>> =
    | ({ success: true; message?: string; } & T)
    | { success: false; error: string; };

/**
 * TODO:: document
 */
export type ActionFailure = {
    success: false;
    error: string;
}

/**
 * TODO:: document
 *
 * @param extra
 */
export function ok<T extends object = Record<never, never>>(extra?: T & { message?: string }) {
    return {success: true as const, ...extra
    } as { success: true; message?: string } & T;
}

/**
 * TODO:: document
 *
 * @param error
 */
export function fail(error: string): ActionFailure {
    return {success: false as const, error};
}
/**
 * Expected, user-safe failure. Throw it inside a transaction to roll the transaction back.
 */
export class ActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ActionError";
    }
}
