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
        },
        background: "#f8f4f4", // Background color
        accent: "#F5EFEB", // Accent color
        text: {
          dark: "#1d2026", // Default dark text
          light: "#FFFFFF", // Corrected to include the `#`
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
