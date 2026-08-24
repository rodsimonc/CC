import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F2A44",
          soft: "#1a3a5c",
          deeper: "#0a1f34",
        },
        gold: {
          DEFAULT: "#C9A961",
          soft: "#d9be7f",
        },
        paper: {
          DEFAULT: "#FAFAF7",
          warm: "#f5f2ea",
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 32px -12px rgba(15, 42, 68, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
