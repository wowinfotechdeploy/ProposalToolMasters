module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
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
