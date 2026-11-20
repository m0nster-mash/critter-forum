import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {createAlert} from "@/features/alerts/create-alert";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import Link from "next/link";
import type {JSX} from "react";

/**
 * Rendered when a route doesn't exist or {@code NotFound()} is called.
 *
 * @fileOverview            A Server Component, so it needs no client code.
 * @module                  `modules/alerts`
 * @status                  Requires cleanup
 *
 * @TODO:                   Replace magic strings with consts
 *
 * @return  {JSX.Element}   The not-found UI.
 */
export default function NotFound(): JSX.Element {

    return (
        <>
            {/* TODO:: replace magic string with const. */}
            <AlertBanner alert={createAlert("APP_NOT_FOUND")}/>
            <p>
                <Link href={resolvePath(PUBLIC_ROUTES.HOME)}>Back to the home page</Link>
            </p>
        </>
    );
}
