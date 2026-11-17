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
        <body>
        <div className="layout">
            <nav>
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Settings</a>
            </nav>

            {children}
        </div>
        </body>
    );
}
