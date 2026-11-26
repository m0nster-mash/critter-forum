/**
 * @fileOverview    The root document shell.
 * @module          core-application
 *
 * @status          Requires refactoring
 * @TODO            Replace content with proper layout at a later date
 */

import layoutStyle from "@/components/styles/layout.module.css"
import {AlertProvider} from "@/features/alerts/client/provider";
import LogoutButton from "@/features/auth/components/logout-button";
import {METADATA} from "@/lib/constants/global";
import {ADMIN_ROUTES, PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import Link from "next/link";
import React, {JSX} from "react";

/**
 * Default document metadata used by the application
 */
export const metadata: Metadata = METADATA;

/**
 * Renders the root document shell.
 *
 * @remarks     Wraps every route in the shared alert provider and global error listeners.
 * @remarks     The navigation links expose the public pages and authenticated dashboard entry point.
 *
 * @TODO        Replace content with proper layout at a later date
 *
 * @param       children        Root layout props containing the active route content
 *
 * @returns     {JSX.Element}   The complete HTML document for the application
 */
export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>): JSX.Element {

    return (
        <html lang="en">
        <body>
        <AlertProvider>
            <div className="layout">
                <nav>
                    <h3>Navigation</h3>
                    <h4>Public Pages</h4>
                    <Link href={resolvePath(PUBLIC_ROUTES.HOME)}>{PUBLIC_ROUTES.HOME.label}</Link>
                    <Link href={resolvePath(PUBLIC_ROUTES.REGISTER)}>{PUBLIC_ROUTES.REGISTER.label}</Link>
                    <Link href={resolvePath(PUBLIC_ROUTES.LOGIN)}>{PUBLIC_ROUTES.LOGIN.label}</Link>
                    <h4>Private Pages</h4>
                    <Link href={resolvePath(PRIVATE_ROUTES.DASHBOARD)}>{PRIVATE_ROUTES.DASHBOARD.label}</Link>
                    <Link href={resolvePath(PRIVATE_ROUTES.SETTINGS)}>{PRIVATE_ROUTES.SETTINGS.label}</Link>
                    <h4>Administration Pages</h4>
                    <Link href={resolvePath(ADMIN_ROUTES.DASHBOARD)}>{ADMIN_ROUTES.DASHBOARD.label}</Link>
                    <Link href={resolvePath(ADMIN_ROUTES.USERS_ACCESS)}>{ADMIN_ROUTES.USERS_ACCESS.label}</Link>
                    <h4>Test Routes</h4>
                    <Link href="/alerts">Alert Tests</Link>
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
