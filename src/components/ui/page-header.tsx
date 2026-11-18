import layoutStyle from "@/components/styles/layout.module.css";
import {PageHeaderProps} from "@/lib/types";

/**
 * A standard header intended to appear at the top of every page.
 *
 * TODO:: add breadcrumbs
 *
 * @param   {PageHeaderProps}   props           The props object for the PageHeader component
 * @param   {ReactNode}         [props.title]   The page's title rendered inside the header
 *  */
export function PageHeader({title}: PageHeaderProps) {

    return (
        <>
            <div className={layoutStyle.pageHeaderArea}>
                <h1 className={layoutStyle.pageHeaderTitle}>{title}</h1>
            </div>
        </>
    );
}
