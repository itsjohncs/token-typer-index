// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                // @ts-ignore
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: ["build", "eslint.config.js", "src/libWrapper.d.ts"],
    },
);
