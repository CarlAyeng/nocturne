/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0B14',
        surface: '#141420',
        'surface-2': '#1B1B2B',
        'surface-3': '#24243A',
        line: 'rgba(255,255,255,0.08)',
        primary: {
          DEFAULT: '#8B5CF6',
          soft: '#A855F7',
          deep: '#6D28D9',
        },
        accent: {
          DEFAULT: '#EC4899',
          soft: '#F472B6',
        },
        glow: '#A855F7',
        ink: '#F5F5FB',
        muted: '#9CA3B8',
        'muted-2': '#6B7280',
        ok: '#22C55E',
        danger: '#EF4444',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.25)',
        card: '0 8px 30px rgba(0,0,0,0.35)',
        lift: '0 16px 50px rgba(0,0,0,0.5)',
        glow: '0 0 40px rgba(168,85,247,0.35)',
        'glow-accent': '0 0 40px rgba(236,72,153,0.35)',
      },
      backgroundImage: {
        brand: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)',
      },
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'equalize': {
          '0%,100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease both',
        'fade-up': 'fade-up 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
        shimmer: 'shimmer 2s infinite linear',
        'spin-slow': 'spin-slow 18s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
