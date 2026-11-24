import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
    // React Bits sources kept exactly as published; their "latest ref" and effect patterns trip the react-hooks rules.
    "components/MagicBento.jsx",
    "components/PillNav.jsx",
    "components/SpotlightCard.jsx",
  ]),
]);

export default eslintConfig;
