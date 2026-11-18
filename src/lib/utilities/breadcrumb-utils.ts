import {ALL_ROUTES, RouteMetadata} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";

/**
 * TODO:: document
 *
 * @param route
 * @param params
 * @param routeRegistry
 */
export function getBreadcrumbs(
    route: RouteMetadata,
    params?: Record<string, string>,
    routeRegistry = ALL_ROUTES
): Array<{
    label: string;
    href?: string
}> {

    const breadcrumbs: Array<{ label: string; href?: string }> = [];
    let current: RouteMetadata | undefined = route;
    const visited = new Set<string>();

    while (current) {

        const currentLabel = current.label;
        if (visited.has(currentLabel)) break;
        visited.add(currentLabel);

        breadcrumbs.unshift({
            label: current.label,
            href: resolvePath(current, params),
        });

        if (current.parent) {
            const parentKey = current.parent as keyof typeof ALL_ROUTES;
            current = routeRegistry[parentKey] as RouteMetadata | undefined;
        } else {
            current = undefined;
        }

        if (breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].href = undefined;
        }

        return breadcrumbs;
    }
}
