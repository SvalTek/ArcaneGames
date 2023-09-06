module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  extends: [
    'eslint:recommended', // Use the recommended rules from ESLint
    'plugin:@typescript-eslint/recommended', // Use the recommended rules from @typescript-eslint
    'prettier', // Make ESLint and Prettier play nice
  ],
  plugins: [
    '@typescript-eslint', // Use additional rules for TypeScript
    'prettier', // Enables prettier rules
  ],
  env: {
    node: true, // Enable Node.js global variables and scoping.
    es6: true, // Enable ES6+ global variables and scoping.
  },
  parserOptions: {
    ecmaVersion: 2021, // Allows parsing of modern ECMAScript features
    sourceType: 'module', // Allows the use of imports and exports
  },
  rules: {
    'linebreak-style': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    // Place your custom ESLint rules here
    'prettier/prettier': 'error', // Turns Prettier rules into ESLint errors
  },
};
