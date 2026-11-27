/**
 * @fileOverview    Defines global constant values
 * @module          shared
 */

import {Metadata} from "next";

/** Site title */
export const SITE_TITLE = "critter-forum" as const;

/** Site descriptor / tag-line */
export const SITE_TAG = "critters: pangaea, maybe?" as const;

/** Default document metadata used by the application */
export const METADATA: Metadata = {
    title: SITE_TITLE,
    description: SITE_TAG,
};

/** Request header types */
export const HEADERS = {
    AUTHORIZATION: "authorization",
};
