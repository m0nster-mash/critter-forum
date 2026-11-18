import {ALL_ROUTES, RouteMetadata} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";

/**
 * Generates an ordered array of breadcrumb objects tracing parent route hierarchy for navigation elements.
 *
 * @param   {RouteMetadata} route                                       Target route object to resolve breadcrumbs for
 * @param   {Record<string, string>} [params]                           Optional; key-value object satisfying dynamic
 *                                                                      route path parameters
 * @param   {Record<string, RouteMetadata>} [routeRegistry=ALL_ROUTES]  Route registry used for parent route hierarchy
 *                                                                      lookups
 *
 * @return  {Array<{label: string, href?: string}>} Ordered array of breadcrumb items with labels and optional resolved
 *                                                  URLs.
 */
export function getBreadcrumbs(
    route: RouteMetadata,
    params?: Record<string, string>,
    routeRegistry: Record<string, RouteMetadata> = ALL_ROUTES
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
    }

    if (breadcrumbs.length > 0) {
        breadcrumbs[breadcrumbs.length - 1].href = undefined;
    }

    return breadcrumbs;
}
