module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111827",
        border: "#e5e7eb",
        ring: "#3b82f6",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
