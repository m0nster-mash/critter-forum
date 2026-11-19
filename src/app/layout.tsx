import layoutStyle from "@/components/styles/layout.module.css"
import {GlobalErrorListeners} from "@/components/ui/global-error-listeners";
import LogoutButton from "@/features/auth/components/logout-button";
import {AlertProvider} from "@/lib/alerts/client/toast-context";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import React from "react";

/**
 * TODO:: document
 */
export const metadata: Metadata = {
    title: "critter-forum",
    description: "critters: pangaea, maybe?",
};

/**
 * TODO:: document
 *
 * @param param0
 * @param param0.children
 * @constructor
 */
export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
        <AlertProvider>
            <GlobalErrorListeners/>
            <div className="layout">
                <nav>
                    <h3>Navigation</h3>
                    <a href={resolvePath(PUBLIC_ROUTES.HOME)}>{PUBLIC_ROUTES.HOME.label}</a>
                    <a href={resolvePath(PRIVATE_ROUTES.DASHBOARD)}>{PRIVATE_ROUTES.DASHBOARD.label}</a>
                    <h4>Authentication</h4>
                    <a href={resolvePath(PUBLIC_ROUTES.REGISTER)}>{PUBLIC_ROUTES.REGISTER.label}</a>
                    <a href={resolvePath(PUBLIC_ROUTES.LOGIN)}>{PUBLIC_ROUTES.LOGIN.label}</a>
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
