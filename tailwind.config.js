/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // This stops Tailwind from injecting global styles
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}

