import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".tmp/**",
      "dashboard/**",
      "node_modules/**",
      "next-env.d.ts",
      "dist/**",
      "build/**",
    ],
  },
  ...nextVitals,
];

export default eslintConfig;
