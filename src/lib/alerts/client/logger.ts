import {BEARER_REDACTED, REDACTED, SENSITIVE_LOG_KEY} from "@/lib/alerts/constants/alerts";

export type ClientLogContext = Record<string, unknown>;

/**
 * Returns a sanitized copy of a value, redacting sensitive property names, bearer tokens, and email addresses. Arrays
 * and nested objects are sanitized recursively; other values are returned unchanged.
 *
 * @param   {unknown}   value   Value to sanitize before it is written to a client log
 * @param   {string}    [key]   Property name used to detect sensitive values
 *
 * @return  {unknown}           Sanitized value
 */
function sanitize(value: unknown, key: string = ""): unknown {

    if (SENSITIVE_LOG_KEY.test(key)) {
        return REDACTED;
    }

    if (typeof value === "string") {

        return value
            .replace(/Bearer\s+\S+/gi, BEARER_REDACTED)
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, REDACTED);
    }

    if(Array.isArray(value)) {

        return value.map((item) => sanitize(item));
    }

    if (value && typeof value === "object") {

        return Object.fromEntries(
            Object.entries(value).map(([key, value]) => [
                key,
                sanitize(value, key),
            ])
        );
    }

    return value;
}
