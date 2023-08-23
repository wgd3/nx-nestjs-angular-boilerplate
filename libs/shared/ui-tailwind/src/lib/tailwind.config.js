const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default module.exports = {
  theme: {
    ...defaultTheme,
  },
  plugins: [require('@tailwindcss/forms')],
};
