import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand-color)",
        background: "var(--site-bg)",
        surface: "var(--site-surface)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
