/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif']
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite alternate',
        'floatClouds': 'floatClouds 80s linear infinite',
        'pulseGlow': 'pulseGlow 2s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '0.2', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1.2)' },
        },
        floatClouds: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200vw)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
