import {ALERT_REGISTRY, AlertCode, FALLBACK_ALERT_CODE} from "@/lib/alerts/registry";
import {AlertDefinition, AlertOverrides, PublicAlert} from "@/lib/alerts/types";

/**
 * Type guard confirming a string is a registered alert code.
 *
 * @param   {string}    code    The value to check
 *
 * @return  {boolean}   True if the code exists in the registry.
 */
export function isAlertCode(code: string): code is AlertCode {
    return Object.hasOwn(ALERT_REGISTRY, code);
}

/**
 * Looks up the registry definition for a code, falling back to the unknown-error definition if the code is not
 * registered (ex. stale or untyped data arriving from elsewhere).
 *
 * @param   {string}    code    The alert code to look up
 *
 * @return  {AlertDefinition}   The matching definition, or the fallback definition.
 */
export function getAlertDefinition(code: string): AlertDefinition {
    return ALERT_REGISTRY[isAlertCode(code) ? code : FALLBACK_ALERT_CODE];
}

/**
 * Replaces `{name}` tokens in a message template. Tokens without a matching param are left intact.
 *
 * @param   {string}                            template    The message template
 * @param   {Record<string, string | number>}   [params]    Optional; values keyed by token name
 *
 * @return  {string}    The message with tokens substituted.
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
    if (!params) {
        return template;
    }
    return template.replace(/\{(\w+)}/g, (token, key: string) =>
        Object.hasOwn(params, key) ? String(params[key]) : token
    );
}

/**
 * Creates a serializable, user-safe alert from a registry code.
 *
 * Pure: no logging and no environment dependencies, so it is safe on both server and client. An unregistered code
 * (only possible via untyped data) resolves to the fallback alert instead of throwing.
 *
 * @param   {AlertCode}         code            The registry code identifying the alert
 * @param   {AlertOverrides}    [overrides]     Optional; per-call severity, presentation, field, ref, and params
 *
 * @return  {PublicAlert}   The alert, ready to return from a server action or hand to the UI.
 */
export function createAlert(
    code: AlertCode,
    overrides: AlertOverrides = {}
): PublicAlert {

    const resolvedCode = isAlertCode(code) ? code : FALLBACK_ALERT_CODE;
    const definition = getAlertDefinition(resolvedCode);

    const alert: PublicAlert = {
        code: resolvedCode,
        severity: overrides.severity ?? definition.severity,
        message: interpolate(definition.message, overrides.params),
        presentation: overrides.presentation ?? definition.presentation,
    };

    if (overrides.field !== undefined) {
        alert.field = overrides.field;
    }
    if (overrides.ref !== undefined) {
        alert.ref = overrides.ref;
    }

    return alert;
}
