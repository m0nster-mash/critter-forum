import {Metadata} from "next";

export const SITE_TITLE = "critter-forum" as const;
export const SITE_TAG = "critters: pangaea, maybe?" as const;


/**
 * Default document metadata used by the application
 */
export const METADATA: Metadata = {
    title: SITE_TITLE,
    description: SITE_TAG,
};
