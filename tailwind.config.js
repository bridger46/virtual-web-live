/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [],
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      "120%": "120% auto",
    },
  },
  variants: {
    extend: {
      backgroundSize: ["hover", "focus"],
    },
  },
  plugins: [],
};
