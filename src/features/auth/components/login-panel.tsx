import {signIn} from "@/lib/auth-client";
import {LoginPanelProps} from "@/lib/types";
import {useRouter} from "next/router";
import {useState} from "react";

export function LoginPanel({onSuccess}: LoginPanelProps) {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true)

        try {
            const attemptSignIn = await signIn.email({
                email: email.trim().toLowerCase(),
                password,
            });

            if (attemptSignIn.error) {
                setError(attemptSignIn.error.message || "Failed to log in. Please check your credentials.");

            } else {
                if (onSuccess) {
                    onSuccess();
                }
                router.push("/home");
                router.refresh();
            }
        } catch(err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login-email">
                            Email Address
                        </label>
                        <input id="login-email"
                               type="email"
                               autoComplete="email"
                               placeholder="email@address.com"
                               value={email}
                               onChange={(loginEvent) => setEmail(loginEvent.target.value)}
                               disabled={loading}
                               required/>
                    </div>
                    <div>
                        <label htmlFor="login-password">
                            Email Address
                        </label>
                        <input id="login-password"
                               type="password"
                               autoComplete="current-password"
                               value={password}
                               onChange={(loginEvent) => setPassword(loginEvent.target.value)}
                               placeholder="••••••••"
                               disabled={loading}
                               required/>
                    </div>
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
