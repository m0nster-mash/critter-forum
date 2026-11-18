import layoutStyle from "@/components/styles/layout.module.css";
import {BREADCRUMBS} from "@/lib/constants/ui";
import {BreadcrumbProps} from "@/lib/types";
import Link from "next/link";
import {Fragment} from "react";

/**
 * Renders a breadcrumb navigation trail.
 *
 * Each item is rendered as a link if an `href` is provided, otherwise as plain text.
 *
 * @param   {BreadcrumbProps}   props               The props object for the Breadcrumbs component
 * @param   {BreadcrumbItem[]}  [props.breadcrumb]  Optional array of breadcrumb items to render
 */
export function Breadcrumbs({breadcrumb}: BreadcrumbProps) {

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
