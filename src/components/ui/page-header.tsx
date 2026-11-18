import layoutStyle from "@/components/styles/layout.module.css";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {PageHeaderProps} from "@/lib/types";

/**
 * A standard header intended to appear at the top of every page.
 *
 * @param   {PageHeaderProps}   props               The props object for the PageHeader component
 * @param   {ReactNode}         props.title         The page's title rendered inside the header
 * @param   {BreadcrumbItem[]}  [props.breadcrumb]  Optional; breadcrumb items for the navigation trail
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
