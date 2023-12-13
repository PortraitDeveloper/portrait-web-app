/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        22: "5.5rem",
        25: "6.25rem",
        120: "30rem",
        122: "30.5rem",
        124: "31rem",
        128: "32rem",
        130: "32.5rem",
        132: "33rem",
        145: "36.25rem",
        200: "50rem",
        228: "57rem",
      },
    },
    fontFamily: {
      sora: ["Sora", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    fontSize: {
      "xs": "0.75rem", // 12px
      "sm": "0.875rem", // 14px
      "md": "1rem", //16px
      "lg": "1.125rem", // 18px
      "xl": "1.25rem", // 20px
      "2xl": "1.5rem", //24px
    },
    screens: {
      xs: "480px",
      // => @media (min-width: 320px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
