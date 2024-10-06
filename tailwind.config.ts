// tailwind.config.ts

import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#fcfcfc", // Base primary color
          light: "#f8f4f4", // Lighter shade of primary
          dark: "#305494", // Darker shade of primary
          dark_hover: "#5e8bdb", // Darker shade of primary hover (light blue)
        },
        background: "#f8f4f4", // Background color
        accent: "#2074d4", // Accent color
        text: {
          dark: "#1d2026", // Default dark text
          light: "#FFFFFF", // Light text
        },
        "light-gray": "#5c5f66", // Medium gray color
      },
    },
  },
  plugins: [],
} satisfies Config;
