/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1B3D', // Deep Midnight Blue
          light: '#1A3673',
        },
        accent: {
          DEFAULT: '#F5A623', // Vibrant Gold/Orange
          hover: '#FFB84D',
        },
        bg: {
          light: '#F8F9FB',
        },
        text: {
          dark: '#1F2937',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0, 0, 0, 0.05)',
        elevated: '0 20px 40px rgba(11, 27, 61, 0.12)',
      },
      scale: {
        '108': '1.08',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}
