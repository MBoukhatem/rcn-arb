/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Pure noir / blanc + nuances graphiques.
        neutral: {
          0: '#FFFFFF',
          50: '#F4F4F4',
          100: '#E6E6E6',
          200: '#CFCFCF',
          300: '#A8A8A8',
          400: '#7A7A7A',
          500: '#525252',
          600: '#363636',
          700: '#222222',
          800: '#141414',
          850: '#0C0C0C',
          900: '#060606',
          950: '#000000',
        },
        // Pourpre rougeâtre — accent unique, parcimonieux.
        accent: {
          50: '#FBE9EC',
          100: '#F4C7CE',
          200: '#E89AA5',
          300: '#D86C7B',
          400: '#C24858',
          500: '#A12A3D',
          600: '#811D2E',
          700: '#641423',
          800: '#4A0D19',
          900: '#2E0810',
        },
        success: { light: '#1E1E1E', dark: '#E6E6E6' },
        error: { light: '#811D2E', dark: '#D86C7B' },
        warning: { light: '#3A3A3A', dark: '#CFCFCF' },
      },
      fontFamily: {
        // Inter pour la grille latine, Cairo pour l'arabe.
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
        // Typographie graphique haute densité.
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        xs: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.06em' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '3xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.03em' }],
        '4xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.035em' }],
        '5xl': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: '-0.04em' }],
        '6xl': ['6rem', { lineHeight: '6rem', letterSpacing: '-0.045em' }],
        'ar-sm': ['1.25rem', { lineHeight: '2.25rem' }],
        'ar-base': ['1.625rem', { lineHeight: '2.75rem' }],
        'ar-lg': ['2.5rem', { lineHeight: '3.5rem' }],
        'ar-xl': ['3.75rem', { lineHeight: '5rem' }],
        'ar-hero': ['6rem', { lineHeight: '7rem' }],
      },
      // Aucun border-radius — design graphique strictement angulaire.
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px', // conservé uniquement pour les pastilles/avatars circulaires
      },
      boxShadow: {
        xs: 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        modal: '0 24px 64px -12px rgba(0, 0, 0, 0.85)',
        'accent-glow': '0 0 0 2px rgba(161, 42, 61, 0.6)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        // Trame typographique graphique : grille fine + ligne pointillée.
        'grid-dot':
          'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        'grid-dot-light':
          'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-dot': '18px 18px',
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
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-soft both',
        'fade-in-up': 'fade-in-up 0.35s ease-soft both',
        'scale-in': 'scale-in 0.2s ease-soft both',
        'spin-slow': 'spin-slow 0.7s linear infinite',
        shimmer: 'shimmer 1.6s ease-snappy infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
