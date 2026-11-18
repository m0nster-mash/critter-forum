"use client";

import {LogoutButtonProps, LogoutProps} from "@/lib/types";
import {signOut} from "better-auth/api";
import {useRouter} from "next/navigation";
import {type MouseEvent, useState} from "react";

export function LogoutButton({
                                 label = "Logout",
                                 redirectTo = "/",
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
                           redirectTo = "/",
                           onSuccess,
                           onBeforeLogout,
                       }: LogoutProps) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async (event?: MouseEvent<HTMLElement>) => {
        if (event) event.preventDefault();
        if (loading) return;

        setLoading(true)
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
            console.error("Logout failed:", err);
            setLoading(false);
        }

        if (children) {
            return (
                <span onClick={handleLogout}
                      role="button"
                      tabIndex={0}>
                 {loading ? "Signing out..." : children}
                </span>
            );
        }

        return (
            <button type="button" onClick={handleLogout} disabled={loading}>
                {loading ? "Signing out..." : "Logout"}
            </button>
        );
    }
}

export default LogoutButton;
