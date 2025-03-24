import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lavenderDawn: {
          surface: "#FFFFFF",
          text: "#1E293B",
          highlightLow: "#F1F5F9",
          highlightMed: "#E2E8F0",
          highlightHigh: "#CBD5E1",
          iris: "#7C3AED",
          accent: "#1E293B",
          accentHover: "#334155",
        },
        lavenderMoon: {
          surface: "#0F172A",
          text: "#F8FAFC",
          highlightLow: "#1E293B",
          highlightMed: "#334155",
          highlightHigh: "#475569",
          iris: "#A78BFA",
          accent: "#F8FAFC",
          accentHover: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};

export default config; 