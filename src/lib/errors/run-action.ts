import {COMMON_MESSAGES} from "@/lib/constants/messages";
import {ForbiddenError} from "@/lib/errors/errors";
import {ActionError, type ActionFailure, type ActionResult, fail} from "./action-result";
import {logError, logWarn} from "./logger";
import {unstable_rethrow} from "next/navigation";

/**
 * Run an action body. Expected failures become results; unexpected ones are logged and made generic.
 *
 * @param source `module.action`, e.g. "shoutbox.moderate"
 * @param fn
 */
export async function runAction<T extends ActionResult>(
    source: string,
    fn: () => Promise<T>,
): Promise<T | ActionFailure> {

    try {
        return await fn();
    } catch(err) {
        if (err instanceof ActionError) return fail(err.message);
        unstable_rethrow(err);

        if(err instanceof ForbiddenError) {
            logWarn({
                source,
                message: "Forbidden",
                err
            })

            logError({source, err});
            return fail(COMMON_MESSAGES.UNEXPECTED);
        }
    }


}
