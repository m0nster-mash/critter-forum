"use client";

import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {AUTH_ERROR_MESSAGES} from "@/features/auth/constants/messages";
import {AUTH_LABELS} from "@/features/auth/constants/ui";
import {signOut} from "@/lib/auth-client";
import {REDIRECT} from "@/lib/constants/globals";
import {LogoutButtonProps, LogoutProps} from "@/lib/types";
import {useRouter} from "next/navigation";
import {type MouseEvent, useState} from "react";

export function LogoutButton({
                                 label = AUTH_LABELS.LOGOUT_LABEL,
                                 redirectTo = REDIRECT,
                                 onBeforeLogout,
                             }: LogoutButtonProps) {
    return (
        <Logout redirectTo={redirectTo} onBeforeLogout={onBeforeLogout}>
            <button type="button">{label}</button>
        </Logout>
    );
}

export function Logout({
                           children,
                           redirectTo = REDIRECT,
                           onSuccess,
                           onBeforeLogout,
                       }: LogoutProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async (event?: MouseEvent<HTMLElement>) => {
        if (event) {
            event.preventDefault();
        }
        if (loading) return;

        setLoading(true);
        try {
            if (onBeforeLogout) {
                await onBeforeLogout();
            }

            await signOut();
            if (onSuccess) {
                onSuccess();
            }
            router.push(redirectTo);
            router.refresh();
        } catch (err) {
            console.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILURE, err);
            setLoading(false);
        }
    };
    if (children) {
        return (
            <span onClick={handleLogout} role="button" tabIndex={0}>
                {loading ? AUTH_ALERTS.LOGOUT_PROCESSING : children}
            </span>
        );
    }

    return (
        <button type="button" onClick={handleLogout} disabled={loading}>
            {loading ? AUTH_ALERTS.LOGOUT_PROCESSING : AUTH_LABELS.LOGOUT_LABEL}
        </button>
    );
}

export default LogoutButton;
