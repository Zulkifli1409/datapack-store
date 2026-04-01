/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./App.jsx",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#ffffff',
          elevated: '#f4f4f5',
          overlay: '#e4e4e7',
          subtle: '#f4f4f5'
        },
        border: {
          subtle: '#e4e4e7',
          default: '#d4d4d8',
          strong: '#a1a1aa'
        },
        text: {
          primary: '#000000',
          secondary: '#3f3f46',
          muted: '#71717a'
        },
        accent: {
          primary: '#000000',
          dim: '#e4e4e7'
        },
        emerald: {
          accent: '#000000',
          dim: '#e4e4e7'
        },
        rose: {
          accent: '#000000',
          dim: '#e4e4e7'
        },
        amber: {
          accent: '#000000',
          dim: '#e4e4e7'
        },
        cyan: {
          accent: '#000000',
          dim: '#e4e4e7'
        }
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0,0,0,0.15)',
        'card-hover': '0 10px 40px -10px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
}