import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["src/app/api/test/route.ts","src/lib/services/googleSignIn.ts","src/app/api/verify-token/route.ts","src/app/api/test/route.ts","src/app/(auth)/text/page.tsx","src/app/(auth)/sign-up/page.tsx","src/app/(auth)/sign-in/page.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
