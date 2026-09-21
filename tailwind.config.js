/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090a0f",
        panel: "#11131b",
        accent: "#a78bfa",
        cyan: "#67e8f9"
      },
      boxShadow: {
        glow: "0 0 45px rgba(167,139,250,.18)"
      }
    }
  },
  plugins: []
};
