/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
 const config = {
  trailingComma: 'es5',
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
