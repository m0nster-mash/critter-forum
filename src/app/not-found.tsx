import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/lib/alerts/create-alert";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import Link from "next/link";
import type {JSX} from "react";

/**
 * Rendered when a route doesn't exist or `notFound()` is called. A Server Component, so it needs no client code.
 *
 * @return  {JSX.Element}   The not-found UI.
 */
export default function NotFound(): JSX.Element {
    return (
        <>
            <AlertBanner alert={createAlert("APP_NOT_FOUND")}/>
            <p>
                <Link href={resolvePath(PUBLIC_ROUTES.HOME)}>Back to the home page</Link>
            </p>
        </>
    );
}
