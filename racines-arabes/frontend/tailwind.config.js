/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Échelle de fond/texte — céramique persane :
        // crème froid (fond clair) → bleu turquoise très profond (fond sombre).
        // 0 = blanc cassé, 50 = crème, paliers hauts = turquoise nuit.
        // Aucun noir pur, aucune teinte rose/marron — base neutre froide.
        neutral: {
          0: '#FCFCFA',
          50: '#F1F4F2',
          100: '#E2E8E6',
          200: '#C8D2D0',
          300: '#A3B1B0',
          400: '#7B8C8A',
          500: '#52706F',
          600: '#365453',
          700: '#264140',
          800: '#1B312F',
          850: '#152826',
          // 900/950 = bleus turquoise très profonds (fonds sombres).
          900: '#102220',
          950: '#0B1817',
        },
        // Accent bleu turquoise — boutons, liens, titres, highlights.
        accent: {
          50: '#DDF0F1',
          100: '#B6DEE0',
          200: '#7FC3C7',
          300: '#4BA5AB',
          400: '#2A878E',
          500: '#1A7B8C',
          600: '#136374',
          700: '#0F4F5E',
          800: '#0B3B47',
          900: '#082A33',
        },
        // Échelle or doré — ornements, surlignages, touches précieuses.
        sand: {
          50: '#FBF3DC',
          100: '#F5E4B6',
          200: '#EDD088',
          300: '#E2BA5A',
          400: '#D9A22B',
          500: '#BE8A22',
          600: '#9C701C',
          700: '#785616',
          800: '#553D11',
          900: '#37280C',
        },
        // Encre — texte principal : bleu-nuit très foncé (jamais #000).
        ink: '#1E2A2E',
        // États : turquoise pour succès, ambre brûlé pour l'erreur.
        success: { light: '#136374', dark: '#7FC3C7' },
        error: { light: '#A8442A', dark: '#E0926F' },
        warning: { light: '#9C701C', dark: '#EDD088' },
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
        'accent-glow': '0 0 0 2px rgba(26, 123, 140, 0.6)',
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
        'marquee-y': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'marquee-y-reverse': {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-soft both',
        'fade-in-up': 'fade-in-up 0.35s ease-soft both',
        'scale-in': 'scale-in 0.2s ease-soft both',
        'spin-slow': 'spin-slow 0.7s linear infinite',
        shimmer: 'shimmer 1.6s ease-snappy infinite',
        marquee: 'marquee 28s linear infinite',
        'marquee-y': 'marquee-y 60s linear infinite',
        'marquee-y-reverse': 'marquee-y-reverse 60s linear infinite',
      },
    },
  },
  plugins: [],
};
