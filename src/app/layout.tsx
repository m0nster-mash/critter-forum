import layoutStyle from "@/components/styles/layout.module.css"
import {GlobalErrorListeners} from "@/components/ui/global-error-listeners";
import LogoutButton from "@/features/auth/components/logout-button";
import {AlertProvider} from "@/lib/alerts/client/toast-context";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
    title: "critter-forum",
    description: "critters: pangaea, maybe?",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <AlertProvider>
            <GlobalErrorListeners/>
            <div className="layout">
                <nav>
                    <h3>Navigation</h3>
                    <a href={resolvePath(PUBLIC_ROUTES.HOME)}>Home</a>
                    <a href={resolvePath(PRIVATE_ROUTES.DASHBOARD)}>Dashboard</a>
                    <h4>Authentication</h4>
                    <a href={resolvePath(PUBLIC_ROUTES.REGISTER)}>Register</a>
                    <a href={resolvePath(PUBLIC_ROUTES.LOGIN)}>Login</a>
                    <LogoutButton/>
                </nav>
                <div className={layoutStyle.contentArea}>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </AlertProvider>
        </body>
        </html>
    );
}
