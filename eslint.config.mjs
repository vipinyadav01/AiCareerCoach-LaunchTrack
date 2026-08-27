import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next v16 ships native flat config, so it is spread directly.
// (The previous FlatCompat wrapper crashed with a circular-structure error
// under ESLint 9.)
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
      "**/*.tsbuildinfo",
    ],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
