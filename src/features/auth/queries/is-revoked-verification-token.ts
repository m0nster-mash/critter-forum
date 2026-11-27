import {ALGORITHM, ENCODING} from "@/features/auth/constants/policy";
import {db} from "@/lib/db/auth/db";
import {revokedVerificationToken} from "@/lib/db/auth/schema";
import {and, eq, gt} from "drizzle-orm";
import {createHash} from "node:crypto";

/**
 * Checks whether a presented verification token has been superseded by a later email.
 *
 * @param token    Raw Better Auth verification token from the verification URL.
 * @returns        True only when its hash is present in the unexpired revocation list.
 */
export async function isRevokedVerificationToken(token: string): Promise<boolean> {

    const tokenHash = createHash(ALGORITHM)
        .update(token)
        .digest(ENCODING.HEX);

    const [revoked] = await db
        .select({tokenHash: revokedVerificationToken.tokenHash})
        .from(revokedVerificationToken)
        .where(and(
            eq(revokedVerificationToken.tokenHash, tokenHash),
            gt(revokedVerificationToken.expiresAt, new Date()),
        ))
        .limit(1);

    return Boolean(revoked);
}
