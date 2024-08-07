module.exports = [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs"
    }
  },
  {
    rules: {
      "arrow-parens": ["off"],
      camelcase: ["off"],
      "prefer-arrow-callback": ["off"],
      "nonblock-statement-body-position": ["off"],
      "consistent-return": ["off"],
      "no-restricted-syntax": ["off"],
      "implicit-arrow-linebreak": ["off"],
      "function-paren-newline": ["off"],
      curly: ["off"],
      "comma-dangle": ["off"],
      "no-use-before-define": ["off"],
      semi: ["error", "always", { omitLastInOneLineBlock: true }],
      quotes: ["error", "double"],
      "no-unused-vars": ["warn"],
      "no-var": ["off"],
      "one-var": ["off"],
      "no-undef": ["error", { ignorePatterns: ["process"] }]
    }
  }
];
