/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kurdish: {
          green: '#276749',
          yellow: '#FCD34D',
          red: '#C8102E',
        }
      }
    },
  },
  plugins: [],
}
