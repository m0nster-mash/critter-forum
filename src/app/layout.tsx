import layoutStyle from "@/components/styles/layout.module.css"
import LogoutButton from "@/features/auth/components/logout-button";
import {PRIVATE_ROUTES, PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import type {Metadata} from "next";
import "./globals.css";
import React, {JSX} from "react";

/**
 * Default site metadata; includes browser title and description.
 *
 * TODO:: replace with globally-defined consts
 */
export const metadata: Metadata = {
    title: "critter-forum",
    description: "critters: pangaea, maybe?",
};

/**
 * Renders the root document shell.
 *
 * Root shells is wrapped in a shared alert provider and global error listeners.
 *
 * NOTE: this page is entirely placeholder content. It will need to be replaced entirely at some point.
 *
 * @param   {React.ReactNode}   param           Root layout props containing the active route content
 * @param   {Readonly}          param.children  Display elements
 *
 * @return {JSX.Element}                        The complete HTML document for the application
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>): JSX.Element {

    return (
        <html lang="en">
        <body>
        <div className="layout">
            <nav>
                <h3>Navigation</h3>
                <a href={resolvePath(PUBLIC_ROUTES.HOME)}>
                    {PUBLIC_ROUTES.HOME.label}
                </a>
                <a href={resolvePath(PRIVATE_ROUTES.DASHBOARD)}>
                    {PRIVATE_ROUTES.DASHBOARD.label}
                </a>

                <h4>Authentication</h4>
                <a href={resolvePath(PUBLIC_ROUTES.REGISTER)}>
                    {PUBLIC_ROUTES.REGISTER.label}
                </a>
                <a href={resolvePath(PUBLIC_ROUTES.LOGIN)}>
                    {PUBLIC_ROUTES.LOGIN.label}
                </a>
                <LogoutButton/>
            </nav>
            <div className={layoutStyle.contentArea}>
                <main>
                    {children}
                </main>
            </div>
        </div>
        </body>
        </html>
    );
}
