import layoutStyle from "@/components/styles/layout.module.css"
import LogoutButton from "@/features/auth/components/logout-button";
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
        <div className="layout">
            <nav>
                <h3>Navigation</h3>
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <h4>Authentication</h4>
                <a href="/register">Register</a>
                <a href="/login">Login</a>
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
