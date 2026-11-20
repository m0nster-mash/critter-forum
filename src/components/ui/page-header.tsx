import layoutStyle from "@/components/styles/layout.module.css";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {PageHeaderProps} from "@/lib/types";

/**
 * @fileOverview                A standard header that appears at the top of every page, showing the page title and
 *                              breadcrumb trail.
 * @status                      Good; may require re-styling later.
 *
 * @param   {PageHeaderProps}   props               The props object for the PageHeader component
 * @param   {ReactNode}         props.title         The page's title rendered inside the header
 * @param   {BreadcrumbItem[]}  [props.breadcrumb]  Breadcrumb items for the navigation trail
 */
export function PageHeader({title, breadcrumb}: PageHeaderProps) {

    return (
        <>
            <div className={layoutStyle.pageHeaderArea}>
                {breadcrumb && <Breadcrumbs breadcrumb={breadcrumb}/>}
                <h1 className={layoutStyle.pageHeaderTitle}>{title}</h1>
            </div>
        </>
    );
}
