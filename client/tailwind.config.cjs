/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#030A2E",
        electric: "#0B66FF",
        cyan: "#1BD9FF",
        amber: "#FFB200"
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(27, 217, 255, 0.35)"
      }
    }
  },
  plugins: []
};