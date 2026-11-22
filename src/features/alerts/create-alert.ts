/**
 * @fileOverview    Creates serializable public alerts from the central alert registry.
 * @module          features/alerts
 */

import {ALERT_TEMPLATE_PATTERNS} from "@/features/alerts/constants/templates";
import {ALERT_REGISTRY, AlertCode, FALLBACK_ALERT_CODE} from "@/features/alerts/registry";
import {AlertDefinition, AlertOverrides, PublicAlert} from "@/features/alerts/types";

/**
 * Type guard confirming a string is a registered alert code.
 *
 * @param       code        The value to check
 *
 * @returns     {boolean}   True if the code exists in the registry.
 */
export function isAlertCode(code: string): code is AlertCode {

    return Object.hasOwn(ALERT_REGISTRY, code);
}

/**
 * Looks up the registry definition for a code.
 *
 * @remarks     Falling back to the unknown-error definition if the code is not registered (ex. stale or untyped data
 *              arriving from elsewhere).
 *
 * @param       code                The alert code to look up
 *
 * @returns     {AlertDefinition}   The matching definition, or the fallback definition.
 */
export function getAlertDefinition(code: string): AlertDefinition {

    return ALERT_REGISTRY[isAlertCode(code) ? code : FALLBACK_ALERT_CODE];
}

/**
 * Replaces `{name}` tokens in a message template.
 *
 * @remarks     Tokens without a matching param are left intact.
 *
 * @param       template    The message template
 * @param       params      Optional; values keyed by token name
 *
 * @returns     {string}    The message with tokens substituted.
 */
function interpolate(
    template: string,
    params?: Record<string, string | number>
): string {

    if (!params) {
        return template;
    }

    return template.replace(ALERT_TEMPLATE_PATTERNS.PARAMETER, (token, key: string) =>
        Object.hasOwn(params, key) ? String(params[key]) : token
    );
}

/**
 * Creates a serializable, user-safe alert from a registry code.
 *
 * @remarks     Pure: no logging and no environment dependencies, so it is safe on both server and client.
 * @remarks     An unregistered code (only possible via untyped data) resolves to fallback alert instead of throwing.
 *
 * @param       code            The registry code identifying the alert
 * @param       overrides       Optional; per-call severity, presentation, field, ref, and params
 *
 * @returns     {PublicAlert}   The alert, ready to return from a server action or hand to the UI.
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

    const field = overrides.field ?? definition.field;
    if (field !== undefined) {
        alert.field = field;
    }
    if (overrides.ref !== undefined) {
        alert.ref = overrides.ref;
    }

    return alert;
}
