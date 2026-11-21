/**
 * TODO: document
 *
 * @module components/ui/page-header
 * @status Requires documentation
 */

import layoutStyle from "@/components/styles/layout.module.css";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {PageHeaderProps} from "@/lib/types";
import {JSX} from "react";

/**
 * @status          Good; may require re-styling later.
 *
 * @fileOverview    A standard header that appears at the top of every page, showing page title and breadcrumb trail.
 *
 * @param           {PageHeaderProps}   props               The props object for the PageHeader component
 * @param           {ReactNode}         props.title         The page's title rendered inside the header
 * @param           {BreadcrumbItem[]}  [props.breadcrumb]  Breadcrumb items for the navigation trail
 *
 * @return          {JSX.Element}       Page Header UI
 */
export function PageHeader({title, breadcrumb}: PageHeaderProps): JSX.Element {

    return (
        <>
            <div className={layoutStyle.pageHeaderArea}>
                {breadcrumb && <Breadcrumbs breadcrumb={breadcrumb}/>}
                <h1 className={layoutStyle.pageHeaderTitle}>{title}</h1>
            </div>
        </>
    );
}
