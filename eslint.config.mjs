import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noHardcodedTexts from "./eslint-rules/no-hardcoded-texts.js";

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
  {
    plugins: {
      custom: {
        rules: {
          "no-hardcoded-texts": noHardcodedTexts,
        },
      },
    },
    rules: {
      "custom/no-hardcoded-texts": "warn",
    },
  },
]);

export default eslintConfig;
