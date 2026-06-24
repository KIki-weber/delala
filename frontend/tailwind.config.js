/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00D9FF',
        'neon-magenta': '#FF00FF',
        'neon-lime': '#39FF14',
        'neon-pink': '#FF10F0',
        'neon-purple': '#BC13FE',
      },
    },
  },
  plugins: [],
}
