import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#fcfcfc", // Base primary color
          light: "#f8f4f4", // Lighter shade of primary
          dark: "#2C5696", // Darker shade of primary
          dark_hover: "#5e8bdb", // Darker shade of primary hover (light blue)
        },
        background_dark: "#f8f4f4", // Background color
        background: "#FFFFFF", // Background color
        accent: "#2e353b", // Accent color
        text: {
          dark: "#17181a", // Default dark text
          light: "#FFFFFF", // Light text
        },
        "light-gray": "#5c5f66", // Medium gray color
      },
    },
  },
  plugins: [],
} satisfies Config;

