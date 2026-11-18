import layoutStyle from "@/components/styles/layout.module.css";
import {PageHeaderProps} from "@/lib/types";

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
export function PageHeader({title}: PageHeaderProps) {

    return (
        <>
            <div className={layoutStyle.pageHeaderArea}>
                <h1 className={layoutStyle.pageHeaderTitle}>{title}</h1>
            </div>
        </>
    );
}
