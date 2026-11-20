import layoutStyle from "@/components/styles/layout.module.css"
import {AlertProvider} from "@/features/alerts/client/alert-provider";
import LogoutButton from "@/features/auth/components/logout-button";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import React, {JSX} from "react";

/**
 * @status          Requires refactoring
 * @TODO            Migrate to global constant
 *
 * @fileOverview    Default document metadata used by the application
 */
export const metadata: Metadata = {
    title: "critter-forum",
    description: "critters: pangaea, maybe?",
};

/**
 * @status          Requires fill replacement
 * @TODO            Replace content with proper layout at a later date
 *
 * @fileOverview    Renders the root document shell.
 * @remarks         Wraps every route in the shared alert provider and global error listeners.
 * @remarks         The navigation links expose the public pages and authenticated dashboard entry point.
 *
 * @param           {Readonly}  props   Root layout props containing the active route content
 *
 * @return          {JSX.Element}       The complete HTML document for the application
 */
export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>): JSX.Element {

    return (
        <html lang="en">
        <body>
        <AlertProvider>
            <div className="layout">
                <nav>
                    <h3>Navigation</h3>
                    <a href={resolvePath(PUBLIC_ROUTES.HOME)}>{PUBLIC_ROUTES.HOME.label}</a>
                    <a href={resolvePath(PRIVATE_ROUTES.DASHBOARD)}>{PRIVATE_ROUTES.DASHBOARD.label}</a>
                    <h4>Authentication</h4>
                    <a href={resolvePath(PUBLIC_ROUTES.REGISTER)}>{PUBLIC_ROUTES.REGISTER.label}</a>
                    <a href={resolvePath(PUBLIC_ROUTES.LOGIN)}>{PUBLIC_ROUTES.LOGIN.label}</a>
                    <h4>Test Routes</h4>
                    <a href="/alerts">Alert Tests</a>
                    <hr/>
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
