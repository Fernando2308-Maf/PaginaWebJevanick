module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e3a8a', light: '#3b5bdb', dark: '#0f2060' },
        secondary: { DEFAULT: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
        tertiary: { DEFAULT: '#14b8a6', light: '#2dd4bf' },
        accent: { DEFAULT: '#f97316', light: '#fb923c', dark: '#ea6b08' },
        dark: { DEFAULT: '#050d1a', 800: '#071425', 700: '#0d2040', 600: '#112a55', 500: '#1a3a6e' },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'float-delay': 'float 7s ease-in-out 3s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow: { '0%, 100%': { opacity: '0.5', transform: 'scale(1)' }, '50%': { opacity: '0.9', transform: 'scale(1.06)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
      },
      boxShadow: {
        glow: '0 0 22px rgba(6,182,212,0.45)',
        'glow-lg': '0 0 50px rgba(6,182,212,0.6)',
        'glow-primary': '0 0 22px rgba(30,58,138,0.4)',
        'glow-accent': '0 0 22px rgba(249,115,22,0.45)',
        card: '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.13)',
        modal: '0 24px 80px rgba(0,0,0,0.4)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
    },
  },
  plugins: [],
};
