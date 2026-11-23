import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

const TS_FILES = ["**/*.{ts,tsx}"];

/**
 * Arsitektur satu arah: shared -> features -> app.
 * - shared (components, hooks, utils, lib, ...) TIDAK boleh import features
 * - feature TIDAK boleh import feature lain
 * - app boleh import features & shared
 */
const boundariesConfig = {
  files: TS_FILES,
  plugins: { boundaries },
  settings: {
    "boundaries/elements": [
      { type: "app", pattern: "src/app" },
      { type: "feature", pattern: "src/features/*", capture: ["featureName"] },
      {
        type: "shared",
        pattern:
          "src/{components,hooks,utils,lib,config,constants,providers,types,services,stores}",
      },
    ],
  },
  rules: {
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        policies: [
          {
            from: { element: { type: "app" } },
            allow: { to: { element: { types: ["feature", "shared", "app"] } } },
          },
          {
            from: { element: { type: "feature" } },
            allow: { to: { element: { type: "shared" } } },
          },
          {
            from: { element: { type: "feature" } },
            allow: {
              to: {
                element: {
                  type: "feature",
                  captured: {
                    featureName: "{{ from.element.captured.featureName }}",
                  },
                },
              },
            },
          },
          {
            from: { element: { type: "shared" } },
            allow: { to: { element: { type: "shared" } } },
          },
        ],
      },
    ],
  },
};

const strictTypeScript = [
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: TS_FILES,
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: TS_FILES,
  })),
  {
    files: TS_FILES,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },
];

// Anti god-component & clean code.
const cleanCodeRules = {
  files: TS_FILES,
  rules: {
    "max-lines": [
      "error",
      { max: 250, skipBlankLines: true, skipComments: true },
    ],
    "max-lines-per-function": [
      "error",
      { max: 140, skipBlankLines: true, skipComments: true },
    ],
    // complexity: ["error", 8],
    // "max-depth": ["error", 3],
    // "max-params": ["error", 3],
    "no-console": "error",
    eqeqeq: ["error", "always"],
    "no-nested-ternary": "error",
    "react/no-multi-comp": ["error", { ignoreStateless: false }],
    "react/jsx-max-depth": ["error", { max: 5 }],
    "react/jsx-no-useless-fragment": "error",
    "react/self-closing-comp": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../../*", "../../../*"],
            message: "Gunakan alias absolut '@/...' alih-alih relative import yang dalam.",
          },
        ],
      },
    ],
  },
};

// Return type eksplisit untuk logika non-komponen (.ts).
const explicitReturnTypes = {
  files: ["**/*.ts"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
  },
};

// Komponen primitif hasil generate shadcn: boleh lebih padat & multi-export.
const shadcnUiRelaxations = {
  files: ["src/components/ui/**/*.{ts,tsx}"],
  rules: {
    "max-lines": "off",
    "max-lines-per-function": "off",
    "react/no-multi-comp": "off",
    complexity: "off",
    "max-params": "off",
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...strictTypeScript,
  boundariesConfig,
  cleanCodeRules,
  explicitReturnTypes,
  shadcnUiRelaxations,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "public/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
