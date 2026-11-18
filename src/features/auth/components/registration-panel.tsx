"use client";

import {registerAccountAction} from "@/features/auth/actions/register-account-action";
import {signIn} from "@/lib/auth-client";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants/globals";
import {AuthFlowProps} from "@/lib/types";
import {useRouter} from "next/navigation";
import {type SubmitEvent, useState} from "react";

/**
 * TODO:: document
 *
 * @param param0
 * @param param0.onSuccess
 * @constructor
 */
export function RegistrationPanel({onSuccess}: AuthFlowProps) {

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setMessage(null);

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName) {
            setError("Please enter a valid name.");
            return;
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
            return;
        }

        setLoading(true);

        try {
            await registerAccountAction({
                name: normalizedName,
                email: normalizedEmail,
                password: password,
            });

            const attemptSignIn = await signIn.email({
                email: normalizedEmail,
                password,
            });

            if (attemptSignIn.error) {
                setError(attemptSignIn.error.message || "Account created, but automatic sign-in failed. Please sign in.");
                return;
            }

            onSuccess?.();
            router.push("/home");
            router.refresh();

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div>
                {error && (<p>{error}</p>)}
                {message && (<p>{message}</p>)}
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="register-username">Username</label>
                    <input id="register-username"
                           type="text"
                           autoComplete="username"
                           placeholder="Username"
                           value={name}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email"
                           type="email"
                           autoComplete="email"
                           placeholder="email@address.com"
                           value={email}
                           onChange={(registerEvent) => setPassword(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <label htmlFor="register-password">Password</label>
                    <input id="register-password"
                           type="password"
                           autoComplete="password"
                           placeholder="••••••••"
                           value={email}
                           onChange={(registerEvent) => setName(registerEvent.target.value)}
                           disabled={loading}
                           required/>
                </div>
                <div>
                    <button type="submit"
                            disabled={loading}>
                        {loading ? "Creating account..." : "Register Account"}
                    </button>
                </div>
            </form>
        </>
    );
}
