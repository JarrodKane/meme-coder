/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /hljs+/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("tailwind-highlightjs")],
};
