/**
 * TODO: document
 *
 * @module components/ui/breadcrumbs
 * @status Requires documentation
 */

import layoutStyle from "@/components/styles/layout.module.css";
import {BREADCRUMBS} from "@/lib/constants/breadcrumbs";
import {BreadcrumbProps} from "@/lib/types";
import Link from "next/link";
import {Fragment, JSX} from "react";

/**
 * @status          Requires restyling
 * @TODO            Restyle breadcrumbs at a later date
 *
 * @fileOverview    Renders a breadcrumb navigation trail.
 *                  Each item is rendered as a link if an `href` is provided, otherwise as plain text.
 *
 * @param           {BreadcrumbProps}   props               The property object for the Breadcrumbs component
 * @param           {BreadcrumbItem[]}  [props.breadcrumb]  Array of breadcrumb items to render
 *
 * @return          {JSX.Element}       Breadcrumb UI
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
