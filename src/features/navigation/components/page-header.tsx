/**
 * @fileOverview    The standard page header component.
 * @module          core-application
 *
 * @status          Requires refactoring (styling)
 * @TODO            Restyle page header at a later date
 */

import layoutStyle from "@/components/styles/layout.module.css";
import {Breadcrumbs} from "@/features/navigation/components/breadcrumbs";
import {PageHeaderProps} from "@/features/navigation/types";
import {JSX} from "react";

/**
 * A standard header that appears at the top of every page, showing page title and breadcrumb trail.
 *
 * @TODO        Restyle page header at a later date
 *
 * @param   title           The page's title rendered inside the header
 * @param   breadcrumb      Breadcrumb items for the navigation trail
 *
 * @returns {JSX.Element}   Page Header UI
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
