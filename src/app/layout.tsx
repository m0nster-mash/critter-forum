import type {Metadata} from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
    title: "empty-next",
    description: "A reusable Next.js starter project.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
