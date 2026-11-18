/**
 * TODO:: document
 * TODO:: replace magic strings with consts
 */
export class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}
