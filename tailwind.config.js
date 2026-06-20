/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A5F',
        accent: '#F97316',
      },
    },
  },
  plugins: [],
}
