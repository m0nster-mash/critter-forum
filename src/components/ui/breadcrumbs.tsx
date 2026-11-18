import layoutStyle from "@/components/styles/layout.module.css";
import {PageHeaderProps} from "@/lib/types";
import Link from "next/link";
import {Fragment} from "react";

/**
 * A standard header intended to appear at the top of every page.
 *
 * TODO:: build this out more:
 * TODO:: add breadcrumbs
 * TODO:: add styling
 *
 * @param {PageHeaderProps} props
 * @param {string} props.title
 */
export function Breadcrumbs({breadcrumb, title}: PageHeaderProps) {

    return (
        {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb">
                {breadcrumb.map((item, index) => (
                    <Fragment key={item.label}>
                        {index > 0 && " / "}
                        {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                    </Fragment>
                ))}
            </nav>
        )}
    <h1>{title}</h1>
</>
    );
}
