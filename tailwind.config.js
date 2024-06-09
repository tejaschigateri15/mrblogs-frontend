/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blueGrey1': '#94A3B8',
        'blueGrey2': '#8C93AE',
        'blueGrey3': '#8882A2',
        'blueGrey4': '#867193',
        'blueGrey5': '#855F80',
        'blueGrey6': '#834D6A',
      },
    },
  },
  plugins: [],
}