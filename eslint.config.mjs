import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import {defineConfig, globalIgnores} from "eslint/config";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "no-console": ["error", {allow: ["warn", "error", "info"]}],
        },
    },
    {
        files: [
            "src/lib/alerts/server/logger.ts",
            "src/lib/alerts/client/logger.ts",
        ],
        rules: {
            "no-console": "off",
        },
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
