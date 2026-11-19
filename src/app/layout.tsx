import layoutStyle from "@/components/styles/layout.module.css"
import {GlobalErrorListeners} from "@/components/ui/global-error-listeners";
import LogoutButton from "@/features/auth/components/logout-button";
import {AlertProvider} from "@/lib/alerts/client/toast-context";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import React, {JSX} from "react";

/**
 * Default document metadata used by the application, including its browser title and description.
 */
export const metadata: Metadata = {
    title: "critter-forum",
    description: "critters: pangaea, maybe?",
};

/**
 * Renders the root document shell and wraps every route in the shared alert provider and global error listeners.
 * The navigation links expose the public pages and authenticated dashboard entry point.
 *
 * @param   {Readonly<{ children: React.ReactNode }>} props  Root layout props containing the active route content
 * @return  {JSX.Element}                                    The complete HTML document for the application
 */
export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>): JSX.Element {
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
                    <h4>Test Pages</h4>
                    <a href={"/alerts"}>Alert Testing</a>
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
