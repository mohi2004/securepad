/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0f111a",
        primary: "#4f46e5",
        secondary: "#6b7280",
      }
    },
  },
  plugins: [],
};
