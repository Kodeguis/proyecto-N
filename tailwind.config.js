/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        romantic: {
          pink: '#ff6699',
          light: '#ffb6d9',
          dark: '#ff3366',
          soft: '#ffeaf4',
        },
        love: {
          gold: '#ffd700',
          rose: '#ff85b8',
          blush: '#ffd6e8',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'heart-beat': 'heart-beat 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'pulse-heart': 'pulse-heart 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'confetti-fall': 'confetti-fall 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'heart-beat': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-heart': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #ffd6e8, #ffeaf4, #ffe0f0, #ffd6e8)',
        'love-gradient': 'linear-gradient(135deg, #ff6699, #ff85b8)',
        'admin-gradient': 'linear-gradient(135deg, #667eea, #764ba2)',
      },
      boxShadow: {
        'romantic': '0 20px 60px rgba(255, 102, 153, 0.3)',
        'love': '0 15px 40px rgba(255, 102, 153, 0.3)',
        'card': '0 10px 30px rgba(255, 102, 153, 0.2)',
      }
    },
  },
  plugins: [],
};
