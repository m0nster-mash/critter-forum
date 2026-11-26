/**
 * @fileOverview    The breadcrumb navigation trail.
 * @module          core-application
 *
 * @status          Requires refactoring (styling)
 * @TODO            Restyle breadcrumbs at a later date
 */

import layoutStyle from "@/components/styles/layout.module.css";
import {BreadcrumbProps} from "@/features/navigation/types";
import {BREADCRUMBS} from "@/features/navigation/constants/breadcrumbs";
import Link from "next/link";
import {Fragment, JSX} from "react";

/**
 * Renders a breadcrumb navigation trail.
 *
 * @remarks     Each item is rendered as a link if an `href` is provided, otherwise as plain text.
 *
 * @TODO        Restyle breadcrumbs at a later date
 *
 * @param       breadcrumb      Array of breadcrumb items to render
 *
 * @returns     {JSX.Element}   Breadcrumb UI
 */
export function Breadcrumbs({breadcrumb}: BreadcrumbProps): JSX.Element {

    return (
        <>
            {breadcrumb && breadcrumb.length > 0 && (
                <nav className={layoutStyle.breadcrumbs} aria-label={BREADCRUMBS.ARIA}>
                    {breadcrumb.map((item, index) => (
                        <Fragment key={item.label}>
                            {index > 0 && BREADCRUMBS.DIVIDER}
                            {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                        </Fragment>
                    ))}
                </nav>
            )}
        </>
    );
}
