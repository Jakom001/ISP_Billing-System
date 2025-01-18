/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "hsl(270, 100%, 40%)",
        blackColor: "hsl(220, 24%, 12%)",
        grayColor: "hsla(0, 0%, 99%, .2)",
        whiteColor: "ffffff",
      }
    },
  },
  plugins: [],
}