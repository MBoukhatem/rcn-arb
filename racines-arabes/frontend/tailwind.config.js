/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // --- Échelle de neutres ---
        neutral: {
          0: '#FFFFFF',
          50: '#F7F7F8',
          100: '#EDEDEF',
          200: '#DEDEE1',
          300: '#C6C6CB',
          400: '#9A9AA1',
          500: '#6E6E76',
          600: '#52525A',
          700: '#3A3A41',
          800: '#26262B',
          850: '#1C1C20',
          900: '#141417',
          950: '#0A0A0C',
        },
        // --- Accent pourpre ---
        accent: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B1675',
        },
        // --- États ---
        success: { light: '#15803D', dark: '#4ADE80' },
        error: { light: '#B91C1C', dark: '#F87171' },
        warning: { light: '#B45309', dark: '#FBBF24' },
      },
      fontFamily: {
        // UI latine sobre — Inter chargée via Google Fonts
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Contenu arabe — Cairo via Google Fonts
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // [taille, { lineHeight, letterSpacing? }]
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
        xs: ['0.75rem', { lineHeight: '1.125rem' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.375rem' }], // 14px
        base: ['1rem', { lineHeight: '1.625rem' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.375rem', { lineHeight: '1.875rem' }], // 22px
        '2xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }], // 28px
        '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.02em' }], // 36px
        '4xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }], // 48px
        '5xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.025em' }], // 60px
        // Tailles dédiées au contenu arabe (interligne plus généreux)
        'ar-sm': ['1.25rem', { lineHeight: '2.25rem' }], // 20px
        'ar-base': ['1.625rem', { lineHeight: '2.75rem' }], // 26px
        'ar-lg': ['2.25rem', { lineHeight: '3.5rem' }], // 36px
        'ar-xl': ['3.25rem', { lineHeight: '4.5rem' }], // 52px
        'ar-hero': ['4.5rem', { lineHeight: '6rem' }], // 72px
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.625rem', // 10px
        lg: '0.875rem', // 14px
        xl: '1.25rem', // 20px
        '2xl': '1.75rem', // 28px
        full: '9999px',
      },
      boxShadow: {
        // Ombres douces, faiblement opaques — discrétion monochrome
        xs: '0 1px 2px 0 rgba(10, 10, 12, 0.04)',
        sm: '0 1px 3px 0 rgba(10, 10, 12, 0.06), 0 1px 2px -1px rgba(10, 10, 12, 0.06)',
        DEFAULT:
          '0 4px 12px -2px rgba(10, 10, 12, 0.08), 0 2px 6px -2px rgba(10, 10, 12, 0.06)',
        md: '0 8px 24px -4px rgba(10, 10, 12, 0.10), 0 4px 8px -4px rgba(10, 10, 12, 0.06)',
        lg: '0 16px 40px -8px rgba(10, 10, 12, 0.14), 0 6px 14px -6px rgba(10, 10, 12, 0.08)',
        // Ombre pour modale en thème sombre (plus profonde)
        modal: '0 24px 64px -12px rgba(0, 0, 0, 0.45)',
        // Halo d'accent (focus, élément sélectionné)
        'accent-glow': '0 0 0 4px rgba(109, 40, 217, 0.14)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)', // sortie douce (entrées UI)
        snappy: 'cubic-bezier(0.4, 0, 0.2, 1)', // standard
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-soft both',
        'fade-in-up': 'fade-in-up 0.35s ease-soft both',
        'scale-in': 'scale-in 0.2s ease-soft both',
        'spin-slow': 'spin-slow 0.7s linear infinite',
        shimmer: 'shimmer 1.6s ease-snappy infinite',
      },
    },
  },
  plugins: [],
};
