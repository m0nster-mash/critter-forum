import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import {defineConfig, globalIgnores} from "eslint/config";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    // All logging goes through the shared loggers (src/lib/alerts). Nothing else may call console.*.
    {
        rules: {
            "no-console": "error",
        },
    },
    {
        files: ["src/lib/alerts/server/logger.ts", "src/lib/alerts/client/logger.ts"],
        rules: {
            "no-console": "off",
        },
    },
    // Throwaway verification scripts: they print results and stub console to capture output.
    {
        files: ["scripts/**"],
        rules: {
            "no-console": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]);

export default eslintConfig;
