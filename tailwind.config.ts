import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF8",
          100: "#FFF8EA",
          200: "#FFF3D9", // Brand base cream
          300: "#FCE7BE",
          400: "#F6D69B",
        },
        brand: {
          dark: "#2A1A12", // Headings & dark elements
          body: "#5A4030", // Body text
          primary: "#9A4F28", // Primary warm brown
          doorMedium: "#55392B", // Deep door brown
          doorLight: "#C98B4D", // Golden/caramel door brown
          doorDark: "#3E2316", // Extra deep door brown
          gold: "#F0B955", // Door knob gold
          whatsapp: "#3A7D54", // WhatsApp green
          whatsappDark: "#2B5E3F",
          tagBg: "#FFF9EE",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-figtree)", "sans-serif"],
        handwriting: ["var(--font-patrick-hand)", "cursive"],
      },
      boxShadow: {
        chunky: "0 4px 0 #1A0E08",
        "chunky-sm": "0 3px 0 #1A0E08",
        "chunky-lg": "0 6px 0 #1A0E08",
        "chunky-green": "0 4px 0 #214730",
        "chunky-gold": "0 4px 0 #B88528",
        "chunky-white": "0 4px 0 rgba(42, 26, 18, 0.25)",
        sticker: "0 2px 6px rgba(42, 26, 18, 0.15), 0 1px 2px rgba(42, 26, 18, 0.2)",
      },
      borderRadius: {
        arch: "160px 160px 0 0",
        "arch-sm": "120px 120px 0 0",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        bob: "bob 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(1deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
