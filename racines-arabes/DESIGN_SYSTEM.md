# Design System — Dictionnaire de Racines Trilitères Arabes

> Document de référence design unique et exploitable. Tous les agents frontend des vagues
> suivantes DOIVENT s'y conformer sans réinterprétation. Aucune valeur ne doit être
> « inventée » : tout ce qui suit (HEX, classes, tailles, durées) est normatif.

Stack ciblée : **React 18.3 + Vite 6 + Tailwind CSS 3.4 + framer-motion 11**.
`darkMode: 'class'` — la classe `dark` est posée sur `<html>` par `ThemeContext`.

---

## 1. Philosophie design

Interface **monochrome** (du blanc pur au noir pur), volontairement sobre et silencieuse,
construite autour d'un **espace négatif généreux** et d'une **typographie soignée**. Le
contenu — le texte arabe — est le seul vrai « héros » visuel : il est grand, aéré, jamais
encombré. Une **unique couleur d'accent pourpre** ponctue l'interface (action primaire,
focus, sélection, lien actif) ; elle reste une *touche*, jamais une surface dominante.
Deux thèmes, clair et sombre, partagent exactement la même grammaire monochrome.

---

## 2. Palette de couleurs (design tokens)

### 2.1 Échelle de neutres (`neutral`)

Échelle froide très légèrement désaturée (pointe imperceptible de bleu) pour éviter le gris
« boue ». Sert à toutes les surfaces, bordures et textes dans les deux thèmes.

| Token          | HEX       | Usage type |
|----------------|-----------|------------|
| `neutral-0`    | `#FFFFFF` | Blanc pur — fond clair, texte sur fond sombre |
| `neutral-50`   | `#F7F7F8` | Fond secondaire clair |
| `neutral-100`  | `#EDEDEF` | Surface clair, hover de lignes |
| `neutral-200`  | `#DEDEE1` | Bordures clair |
| `neutral-300`  | `#C6C6CB` | Bordures fortes / disabled clair |
| `neutral-400`  | `#9A9AA1` | Texte muted clair / texte secondaire sombre |
| `neutral-500`  | `#6E6E76` | Texte secondaire clair |
| `neutral-600`  | `#52525A` | — |
| `neutral-700`  | `#3A3A41` | Bordures sombre |
| `neutral-800`  | `#26262B` | Surface sombre |
| `neutral-850`  | `#1C1C20` | Fond secondaire sombre |
| `neutral-900`  | `#141417` | Fond primaire sombre |
| `neutral-950`  | `#0A0A0C` | Noir profond — texte primaire clair, overlay |

### 2.2 Couleur d'accent — pourpre (`accent`)

**Teinte retenue : `#6D28D9` (violet-700)** comme pourpre principal (`accent-600`).

**Justification du choix.** On tranche pour `#6D28D9` plutôt que `#7C3AED` : c'est une
teinte plus **profonde et raffinée**, moins « néon » que `#7C3AED`, qui s'éloigne du cliché
« gradient violet d'IA » et tient mieux son rôle de touche discrète sur du monochrome.
Surtout, `#6D28D9` **passe le contraste AA en texte normal sur fond blanc** (ratio 6.0:1),
ce que `#7C3AED` ne fait pas (4.4:1, limite). Le pourpre principal est donc volontairement
sombre côté action ; une teinte plus claire (`accent-400`) est réservée à l'usage *sur fond
sombre* où il faut au contraire éclaircir.

| Token         | HEX       | Usage |
|---------------|-----------|-------|
| `accent-50`   | `#F5F3FF` | Fond de badge sélectionné (thème clair), halo très léger |
| `accent-100`  | `#EDE9FE` | Fond hover discret, surface sélectionnée clair |
| `accent-200`  | `#DDD6FE` | Bordure d'élément sélectionné clair |
| `accent-300`  | `#C4B5FD` | Focus ring sur fond sombre, texte accent désaturé |
| `accent-400`  | `#A78BFA` | **Accent sur fond sombre** (liens, texte accent, icônes) |
| `accent-500`  | `#8B5CF6` | Hover du bouton primaire en thème sombre |
| `accent-600`  | `#6D28D9` | **Pourpre principal** — bouton primaire, focus ring clair |
| `accent-700`  | `#5B21B6` | Hover du bouton primaire en thème clair, pressed |
| `accent-800`  | `#4C1D95` | Pressed profond, bordure accent forte |
| `accent-900`  | `#3B1675` | Accent quasi-noir, usages rares |

### 2.3 Couleurs d'état (status)

Désaturées pour rester cohérentes avec la sobriété monochrome (jamais des couleurs vives).

| Rôle      | Clair (`-light`) | Sombre (`-dark`) | Fond léger clair | Fond léger sombre |
|-----------|------------------|------------------|------------------|-------------------|
| `success` | `#15803D`        | `#4ADE80`        | `#F0FDF4`        | `#13301E`         |
| `error`   | `#B91C1C`        | `#F87171`        | `#FEF2F2`        | `#3A1515`         |
| `warning` | `#B45309`        | `#FBBF24`        | `#FFFBEB`        | `#3A2A0F`         |

### 2.4 Tokens sémantiques — Thème CLAIR

| Token sémantique | HEX        | Source       |
|------------------|------------|--------------|
| `bg-primary`     | `#FFFFFF`  | neutral-0    |
| `bg-secondary`   | `#F7F7F8`  | neutral-50   |
| `surface`        | `#FFFFFF`  | neutral-0 (cartes ; bordure assure la séparation) |
| `surface-raised` | `#FFFFFF`  | neutral-0 + ombre (modale, dropdown) |
| `border`         | `#DEDEE1`  | neutral-200  |
| `border-strong`  | `#C6C6CB`  | neutral-300  |
| `text-primary`   | `#141417`  | neutral-900  |
| `text-secondary` | `#52525A`  | neutral-600  |
| `text-muted`     | `#9A9AA1`  | neutral-400  |
| `accent`         | `#6D28D9`  | accent-600   |
| `accent-hover`   | `#5B21B6`  | accent-700   |
| `accent-soft`    | `#F5F3FF`  | accent-50 (fond sélectionné) |
| `focus-ring`     | `#6D28D9`  | accent-600   |
| `success`        | `#15803D`  | success-light |
| `error`          | `#B91C1C`  | error-light  |
| `warning`        | `#B45309`  | warning-light |

### 2.5 Tokens sémantiques — Thème SOMBRE

| Token sémantique | HEX        | Source        |
|------------------|------------|---------------|
| `bg-primary`     | `#141417`  | neutral-900   |
| `bg-secondary`   | `#1C1C20`  | neutral-850   |
| `surface`        | `#1C1C20`  | neutral-850   |
| `surface-raised` | `#26262B`  | neutral-800 (modale, dropdown) |
| `border`         | `#3A3A41`  | neutral-700   |
| `border-strong`  | `#52525A`  | neutral-600   |
| `text-primary`   | `#F7F7F8`  | neutral-50    |
| `text-secondary` | `#9A9AA1`  | neutral-400   |
| `text-muted`     | `#6E6E76`  | neutral-500   |
| `accent`         | `#A78BFA`  | accent-400 (éclairci pour le contraste sur fond sombre) |
| `accent-hover`   | `#C4B5FD`  | accent-300    |
| `accent-soft`    | `#2A2342`  | violet désaturé sombre (fond sélectionné) |
| `accent-solid`   | `#6D28D9`  | accent-600 (remplissage du bouton primaire en sombre) |
| `focus-ring`     | `#A78BFA`  | accent-400    |
| `success`        | `#4ADE80`  | success-dark  |
| `error`          | `#F87171`  | error-dark    |
| `warning`        | `#FBBF24`  | warning-dark  |

> Note importante sur le bouton primaire : en thème **clair** le bouton primaire est rempli
> en `accent-600` avec texte blanc ; en thème **sombre** il reste rempli en `accent-600`
> (`accent-solid`) avec texte blanc — c'est volontaire : un bouton plein en `accent-400` sur
> fond sombre serait délavé. Le token `accent` (= `accent-400` en sombre) sert au **texte**
> et aux **liens**, pas au remplissage des boutons.

---

## 3. Configuration Tailwind

### 3.1 `tailwind.config.js` — contenu prêt-à-coller

```js
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
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],      // 11px
        xs: ['0.75rem', { lineHeight: '1.125rem' }],        // 12px
        sm: ['0.875rem', { lineHeight: '1.375rem' }],       // 14px
        base: ['1rem', { lineHeight: '1.625rem' }],         // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],        // 18px
        xl: ['1.375rem', { lineHeight: '1.875rem' }],       // 22px
        '2xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],   // 28px
        '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.02em' }],  // 36px
        '4xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }],      // 48px
        '5xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.025em' }],     // 60px
        // Tailles dédiées au contenu arabe (interligne plus généreux)
        'ar-sm': ['1.25rem', { lineHeight: '2.25rem' }],    // 20px
        'ar-base': ['1.625rem', { lineHeight: '2.75rem' }], // 26px
        'ar-lg': ['2.25rem', { lineHeight: '3.5rem' }],     // 36px
        'ar-xl': ['3.25rem', { lineHeight: '4.5rem' }],     // 52px
        'ar-hero': ['4.5rem', { lineHeight: '6rem' }],      // 72px
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',   // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.625rem',  // 10px
        lg: '0.875rem',  // 14px
        xl: '1.25rem',   // 20px
        '2xl': '1.75rem',// 28px
        full: '9999px',
      },
      boxShadow: {
        // Ombres douces, faiblement opaques — discrétion monochrome
        xs: '0 1px 2px 0 rgba(10, 10, 12, 0.04)',
        sm: '0 1px 3px 0 rgba(10, 10, 12, 0.06), 0 1px 2px -1px rgba(10, 10, 12, 0.06)',
        DEFAULT: '0 4px 12px -2px rgba(10, 10, 12, 0.08), 0 2px 6px -2px rgba(10, 10, 12, 0.06)',
        md: '0 8px 24px -4px rgba(10, 10, 12, 0.10), 0 4px 8px -4px rgba(10, 10, 12, 0.06)',
        lg: '0 16px 40px -8px rgba(10, 10, 12, 0.14), 0 6px 14px -6px rgba(10, 10, 12, 0.08)',
        // Ombre pour modale en thème sombre (plus profonde)
        modal: '0 24px 64px -12px rgba(0, 0, 0, 0.45)',
        // Halo d'accent (focus, élément sélectionné)
        'accent-glow': '0 0 0 4px rgba(109, 40, 217, 0.14)',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.22, 1, 0.36, 1)',     // sortie douce (entrées UI)
        'snappy': 'cubic-bezier(0.4, 0, 0.2, 1)',     // standard
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
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-soft both',
        'fade-in-up': 'fade-in-up 0.35s ease-soft both',
        'scale-in': 'scale-in 0.2s ease-soft both',
        'spin-slow': 'spin-slow 0.7s linear infinite',
        'shimmer': 'shimmer 1.6s ease-snappy infinite',
      },
    },
  },
  plugins: [],
};
```

### 3.2 Stratégie de thème — décision normative

**Approche imposée : variant `dark:` de Tailwind**, PAS de variables CSS sémantiques par
composant.

- Le toggle de `ThemeContext` ajoute/retire la classe `dark` sur `<html>`.
- Chaque composant déclare le couple clair / sombre directement :
  `class="bg-neutral-0 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"`.
- **Raison du choix** : c'est l'approche la plus idiomatique avec `darkMode: 'class'`,
  la plus lisible pour les agents suivants et celle qui colle au reste de l'écosystème
  Tailwind v3. Une couche de variables CSS sémantiques ajouterait une indirection inutile
  (D8 — anti sur-ingénierie).
- **Règle de cohérence** : on n'utilise JAMAIS de variables CSS de couleur dans le JSX.
  Les seuls tokens manipulés en JSX sont les classes utilitaires Tailwind
  (`neutral-*`, `accent-*`, `success-*`...). Les variables CSS du §3.3 servent
  uniquement aux styles globaux de `index.css` (scrollbar, sélection), pas aux composants.

Table de correspondance token sémantique → classes Tailwind (à appliquer mécaniquement) :

| Token sémantique | Classe clair        | Classe sombre              |
|------------------|---------------------|----------------------------|
| `bg-primary`     | `bg-neutral-0`      | `dark:bg-neutral-900`      |
| `bg-secondary`   | `bg-neutral-50`     | `dark:bg-neutral-850`      |
| `surface`        | `bg-neutral-0`      | `dark:bg-neutral-850`      |
| `surface-raised` | `bg-neutral-0`      | `dark:bg-neutral-800`      |
| `border`         | `border-neutral-200`| `dark:border-neutral-700`  |
| `border-strong`  | `border-neutral-300`| `dark:border-neutral-600`  |
| `text-primary`   | `text-neutral-900`  | `dark:text-neutral-50`     |
| `text-secondary` | `text-neutral-600`  | `dark:text-neutral-400`    |
| `text-muted`     | `text-neutral-400`  | `dark:text-neutral-500`    |
| `accent` (texte) | `text-accent-600`   | `dark:text-accent-400`     |
| `accent` (fond)  | `bg-accent-600`     | `dark:bg-accent-600`       |
| `accent-hover`   | `hover:bg-accent-700`| `dark:hover:bg-accent-500`|
| `focus-ring`     | `ring-accent-600`   | `dark:ring-accent-400`     |

### 3.3 `src/styles/index.css` — `@layer base` recommandés

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --scrollbar-track: #F7F7F8;
    --scrollbar-thumb: #C6C6CB;
    --selection-bg: #EDE9FE;
    --selection-fg: #3B1675;
  }

  html.dark {
    --scrollbar-track: #1C1C20;
    --scrollbar-thumb: #3A3A41;
    --selection-bg: #4C1D95;
    --selection-fg: #F5F3FF;
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
    /* Empêche un flash de thème : ThemeContext pose .dark avant le rendu React */
  }

  body {
    @apply bg-neutral-0 text-neutral-900 font-sans antialiased;
    @apply dark:bg-neutral-900 dark:text-neutral-50;
    transition: background-color 0.2s ease, color 0.2s ease;
    min-height: 100vh;
  }

  /* Tout texte arabe : direction RTL + police Cairo + interligne aéré */
  [lang='ar'],
  .arabic {
    @apply font-arabic;
    direction: rtl;
    unicode-bidi: isolate;
  }

  /* Titres en police latine, légèrement resserrés */
  h1, h2, h3, h4 {
    @apply font-sans tracking-tight;
    text-wrap: balance;
  }

  /* Sélection de texte teintée pourpre discret */
  ::selection {
    background-color: var(--selection-bg);
    color: var(--selection-fg);
  }

  /* Scrollbar sobre et monochrome */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }
  *::-webkit-scrollbar { width: 10px; height: 10px; }
  *::-webkit-scrollbar-track { background: var(--scrollbar-track); }
  *::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 9999px;
    border: 2px solid var(--scrollbar-track);
  }

  /* Focus visible global cohérent (clavier uniquement) */
  :focus-visible {
    outline: 2px solid #6D28D9;
    outline-offset: 2px;
    border-radius: 4px;
  }
  html.dark :focus-visible {
    outline-color: #A78BFA;
  }
}

@layer components {
  /* Squelette de chargement réutilisable */
  .skeleton {
    @apply bg-neutral-100 dark:bg-neutral-800 rounded-md;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.45) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    @apply animate-shimmer;
  }
  html.dark .skeleton {
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.06) 50%,
      transparent 100%
    );
  }
}
```

> **Anti-flash de thème.** Dans `index.html`, AVANT le `<script type="module">` du bundle,
> placer un petit script inline qui lit `localStorage.theme` et pose la classe `dark` sur
> `<html>` immédiatement (voir §4.4).

---

## 4. Typographie

### 4.1 Polices

| Famille | Rôle | Classe Tailwind | Graisses chargées |
|---------|------|-----------------|-------------------|
| **Inter** | Toute l'interface latine (UI, labels, paragraphes FR/EN, navigation) | `font-sans` | 400, 500, 600, 700 |
| **Cairo** | Tout le contenu arabe (mots, racines, schèmes, lettres du picker) | `font-arabic` | 400, 600, 700 |

Inter : grotesque neutre, hautement lisible, sobre — cohérent avec une UI monochrome
silencieuse. Cairo : police arabe humaniste moderne, excellente lisibilité à grande taille,
parfaitement adaptée à la mise en valeur des racines.

### 4.2 Chargement Google Fonts — `index.html`

À placer dans le `<head>` de `frontend/index.html` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

### 4.3 Échelle typographique

#### Texte latin (UI)

| Rôle | Classe Tailwind | Taille / interligne | Graisse |
|------|-----------------|---------------------|---------|
| Hero / titre de page d'accueil | `text-5xl` (mobile : `text-4xl`) | 60 / 64 | `font-bold` (700) |
| Titre de page (H1) | `text-3xl` | 36 / 42 | `font-bold` (700) |
| Titre de section (H2) | `text-2xl` | 28 / 36 | `font-semibold` (600) |
| Sous-titre (H3) | `text-xl` | 22 / 30 | `font-semibold` (600) |
| Titre de carte (H4) | `text-lg` | 18 / 28 | `font-semibold` (600) |
| Corps de texte | `text-base` | 16 / 26 | `font-normal` (400) |
| Texte secondaire | `text-sm` | 14 / 22 | `font-normal` (400) |
| Légende / méta | `text-xs` | 12 / 18 | `font-medium` (500) |
| Micro-label / overline | `text-2xs uppercase tracking-wide` | 11 / 16 | `font-semibold` (600) |

#### Texte arabe (contenu) — utiliser les tailles `ar-*`

| Rôle | Classe Tailwind | Taille / interligne | Graisse |
|------|-----------------|---------------------|---------|
| Racine en vedette (RootDetail, hero) | `font-arabic text-ar-hero` | 72 / 96 | `font-bold` (700) |
| Mot dérivé principal (WordCard) | `font-arabic text-ar-xl` | 52 / 72 | `font-bold` (700) |
| Racine dans une carte (RootCard) | `font-arabic text-ar-lg` | 36 / 56 | `font-semibold` (600) |
| Mot arabe en ligne / liste | `font-arabic text-ar-base` | 26 / 44 | `font-normal` (400) |
| Schème / translittération arabe | `font-arabic text-ar-sm` | 20 / 36 | `font-normal` (400) |
| Lettre du LetterPicker | `font-arabic text-ar-lg` | 36 / 56 | `font-semibold` (600) |

**Règles d'or pour le texte arabe :**
1. Toujours `dir="rtl"` et `lang="ar"` (ou la classe `.arabic`) sur le conteneur arabe.
2. Toujours `font-arabic` — jamais Inter sur de l'arabe.
3. Interligne large (déjà intégré aux tokens `ar-*`) — l'arabe a des hampes hautes/basses.
4. La translittération latine (`k-t-b`) reste en `font-sans`, `text-muted`, souvent en italique.
5. Ne jamais mettre l'arabe en `uppercase` ni en `tracking` négatif.

### 4.4 Script anti-flash de thème — `index.html`

À placer juste avant la fermeture du `<head>`, AVANT le bundle :

```html
<script>
  (function () {
    var t = localStorage.getItem('theme');
    var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && sysDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

---

## 5. Guide des composants

Convention : chaque composant donne ses **classes Tailwind complètes**. Le couple
clair / sombre est toujours explicite. `tx` = `transition-colors duration-150`.

### 5.1 Button

Conteneur de base commun à tous les variants :
`inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-150 ease-snappy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none`

Tailles :
- `sm` : `h-9 px-3.5 text-sm`
- `md` (défaut) : `h-11 px-5 text-sm`
- `lg` : `h-13 px-7 text-base` (h-13 = 3.25rem, via `h-[3.25rem]`)

| Variant | Clair | Sombre | Hover | Focus ring |
|---------|-------|--------|-------|------------|
| **primary** (pourpre) | `bg-accent-600 text-neutral-0` | `dark:bg-accent-600 dark:text-neutral-0` | `hover:bg-accent-700 dark:hover:bg-accent-500` | `ring-accent-600 dark:ring-accent-400 ring-offset-neutral-0 dark:ring-offset-neutral-900` |
| **secondary** | `bg-neutral-0 text-neutral-900 border border-neutral-300` | `dark:bg-neutral-800 dark:text-neutral-50 dark:border-neutral-600` | `hover:bg-neutral-50 hover:border-neutral-400 dark:hover:bg-neutral-700` | idem primary (ring accent) |
| **ghost** | `bg-transparent text-neutral-700` | `dark:text-neutral-300` | `hover:bg-neutral-100 dark:hover:bg-neutral-800` | idem |
| **danger** | `bg-transparent text-error-light border border-error-light/40` | `dark:text-error-dark dark:border-error-dark/40` | `hover:bg-error-light/8 dark:hover:bg-error-dark/12` | `ring-error-light dark:ring-error-dark` |

États :
- **disabled** : `disabled:opacity-50 disabled:pointer-events-none` (déjà dans la base).
- **loading** : afficher un `Spinner` taille `sm` à gauche du label, `pointer-events-none`,
  texte du label maintenu visible (ne pas le cacher). Le bouton garde sa largeur.
- **pressed** (optionnel) : `active:scale-[0.98]`.

> Le bouton **primary** est le seul élément qui porte une surface pourpre pleine. Il doit
> rester rare dans une vue (une, parfois deux actions primaires par écran maximum).

### 5.2 Input

Structure : `<label>` + `<input>` + zone de message (erreur OU aide).

- **Label** : `block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5`.
- **Input (base)** :
  `w-full h-11 px-3.5 rounded-md text-sm bg-neutral-0 text-neutral-900 border border-neutral-300 placeholder:text-neutral-400 transition-colors duration-150`
  `dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700 dark:placeholder:text-neutral-500`
- **Focus** :
  `focus:outline-none focus:border-accent-600 focus:ring-4 focus:ring-accent-600/14`
  `dark:focus:border-accent-400 dark:focus:ring-accent-400/20`
- **État erreur** :
  `border-error-light ring-error-light/14 dark:border-error-dark dark:ring-error-dark/20`
  + message : `mt-1.5 text-xs font-medium text-error-light dark:text-error-dark`.
- **Texte d'aide** (non-erreur) : `mt-1.5 text-xs text-neutral-400 dark:text-neutral-500`.
- **disabled** : `opacity-60 cursor-not-allowed bg-neutral-50 dark:bg-neutral-900`.
- **Champ de saisie arabe** (ex. recherche de mot arabe) : ajouter `font-arabic text-ar-sm`
  + `dir="rtl"` ; hauteur portée à `h-13`.

> Bonus « validation temps réel » (D9) : le passage en état erreur/succès se fait au blur
> puis en direct ensuite. État succès optionnel : `border-success-light dark:border-success-dark`
> + petite coche `text-success-*` à droite. Rester discret.

### 5.3 Badge — types morphologiques

Base : `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold uppercase tracking-wide whitespace-nowrap`.

Principe : **majoritairement monochrome**. Chaque type a sa propre nuance de gris (pour les
distinguer en un coup d'œil dans une `WordList`), mais aucun badge n'est coloré au repos.
Le badge **sélectionné / actif** (filtre choisi, type en cours de consultation) passe en
**pourpre**. Le badge `tense` (MADI/MUDARI/AMR) suit le même principe monochrome.

Nuances par type (les 7 `WORD_TYPES`) — état NON sélectionné :

| Type (`WORD_TYPES`) | Libellé FR | Classe fond/texte clair | Classe sombre |
|---------------------|-----------|--------------------------|---------------|
| `VERB`         | Verbe         | `bg-neutral-900 text-neutral-0`       | `dark:bg-neutral-50 dark:text-neutral-900` |
| `MASDAR`       | Masdar        | `bg-neutral-100 text-neutral-700 border border-neutral-300` | `dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600` |
| `ACTIVE_PART`  | Nom d'agent   | `bg-neutral-200 text-neutral-800`     | `dark:bg-neutral-700 dark:text-neutral-100` |
| `PASSIVE_PART` | Nom de patient| `bg-neutral-0 text-neutral-700 border border-neutral-400` | `dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-500` |
| `NOUN_PLACE`   | Nom de lieu   | `bg-neutral-50 text-neutral-600 border border-neutral-200` | `dark:bg-neutral-850 dark:text-neutral-400 dark:border-neutral-700` |
| `NOUN_TOOL`    | Nom d'instrument | `bg-neutral-100 text-neutral-500 border border-dashed border-neutral-300` | `dark:bg-neutral-800 dark:text-neutral-400 dark:border-dashed dark:border-neutral-600` |
| `ELATIVE`      | Élatif        | `bg-neutral-700 text-neutral-0`       | `dark:bg-neutral-600 dark:text-neutral-0` |

État **sélectionné / actif** (tous types, écrase la nuance) :
`bg-accent-600 text-neutral-0 border-transparent` (identique clair et sombre — le pourpre
plein fonctionne dans les deux thèmes pour ce micro-élément).

Badge `tense` (verbes) : même base, fond `bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400`, sans bordure.

### 5.4 Modal (maison — pas de @headlessui)

- **Overlay** : `fixed inset-0 z-50 bg-neutral-950/45 dark:bg-neutral-950/70 backdrop-blur-sm`,
  animation `fade-in`.
- **Conteneur de centrage** : `fixed inset-0 z-50 flex items-center justify-center p-4`.
- **Surface** :
  `w-full max-w-lg rounded-xl bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg dark:shadow-modal`
  animation `scale-in`.
- **En-tête** : `flex items-start justify-between px-6 pt-6 pb-4` — titre `text-xl font-semibold`,
  bouton fermeture = `Button` variant `ghost` taille `sm` (icône ✕).
- **Corps** : `px-6 py-2 max-h-[70vh] overflow-y-auto`.
- **Pied** : `flex justify-end gap-3 px-6 pt-4 pb-6` — action secondaire (`ghost`/`secondary`)
  puis action primaire (`primary`, ou `danger` pour une confirmation de suppression).
- **Comportement** : fermeture sur `Esc` et clic overlay ; `focus-trap` interne ;
  `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointant le titre ;
  `document.body` passe en `overflow-hidden` à l'ouverture.

### 5.5 Pagination

Conteneur : `flex items-center justify-center gap-1.5`.

- **Bouton page** : `min-w-9 h-9 px-2 rounded-md text-sm font-medium transition-colors`
  - Inactif : `text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800`
  - **Actif** : `bg-accent-600 text-neutral-0 hover:bg-accent-600` (pourpre, dans les deux thèmes)
- **Préc / Suiv** : même style que bouton inactif, avec icône chevron ; `disabled:opacity-40 disabled:pointer-events-none` aux extrémités.
- **Ellipsis** (`…`) : `text-neutral-400 dark:text-neutral-500 px-1 select-none`.
- Affichage facultatif du total : `text-xs text-neutral-400` aligné à part.

### 5.6 Spinner

- SVG cercle, trait `2.5`, classe `animate-spin-slow`.
- Couleur : `text-accent-600 dark:text-accent-400` (sur fond neutre) ;
  `text-neutral-0` quand placé dans un bouton primaire.
- Tailles : `sm` = `h-4 w-4`, `md` = `h-6 w-6`, `lg` = `h-9 w-9`.
- Track du cercle à `opacity-25`, arc actif à `opacity-100`.
- Pour un chargement de page complet : Spinner `lg` centré + label optionnel
  `mt-3 text-sm text-neutral-400`. Préférer les **squelettes** (`.skeleton`) pour le
  chargement de listes de cartes.

### 5.7 Navbar

- **Conteneur** : `sticky top-0 z-40 h-16 w-full border-b transition-colors`
  `bg-neutral-0/85 border-neutral-200 dark:bg-neutral-900/85 dark:border-neutral-800`
  `backdrop-blur-md` (effet verre).
- **Intérieur** : `mx-auto max-w-7xl h-full px-4 sm:px-6 flex items-center justify-between gap-4`.
- **Logo / marque** : à gauche, nom arabe `نظام الجذور` en `font-arabic text-ar-sm font-bold`
  + libellé latin discret optionnel ; `text-neutral-900 dark:text-neutral-50`.
- **Liens de navigation** : `text-sm font-medium px-3 py-2 rounded-md transition-colors`
  - Inactif : `text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:bg-neutral-800`
  - **Actif** (`NavLink` route courante) : `text-accent-600 dark:text-accent-400`
    + soulignement pourpre : trait `h-0.5 bg-accent-600 dark:bg-accent-400` sous le lien
    (via pseudo-élément ou `<span>` absolu animé avec `layoutId` framer-motion).
- **Toggle de thème** : `Button` variant `ghost` taille `sm`, icône soleil/lune,
  `aria-label` explicite.
- **Zone droite** : sélecteur de langue (FR/EN, ghost sm), puis selon l'auth :
  liens `Connexion` (ghost) + `Inscription` (`Button` primary sm), ou avatar/menu profil.
- **Mobile** (`< md`) : liens repliés dans un menu hamburger (panneau `fade-in-up`,
  surface `bg-neutral-0 dark:bg-neutral-900`, séparateurs `border-neutral-200/700`).

### 5.8 Footer

- **Conteneur** : `border-t bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800`.
- **Intérieur** : `mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4`.
- **Contenu** : marque arabe `font-arabic` à gauche ; liens secondaires (À propos, Explorer)
  en `text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50` ;
  mention de copyright `text-xs text-neutral-400 dark:text-neutral-500`.
- Sobre, sans surcharge — beaucoup d'espace, une seule ligne sur desktop.

### 5.9 Card — RootCard & WordCard

**Base commune (carte cliquable)** :
`group relative rounded-xl border bg-neutral-0 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-700 p-6 transition-all duration-200 ease-soft`
Hover : `hover:border-accent-300 dark:hover:border-accent-400/50 hover:shadow-md hover:-translate-y-0.5`
Focus (carte focusable) : `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400`.

**RootCard** — présente une racine :
- La racine en grand, centrée : `font-arabic text-ar-lg font-semibold text-neutral-900 dark:text-neutral-50`,
  les 3 lettres espacées (`gap-3` ou `tracking` via espaces).
- Translittération sous la racine : `text-sm text-neutral-400 dark:text-neutral-500 italic` (latin).
- Sens (`meaningFr`) : `text-sm text-neutral-600 dark:text-neutral-400`, 2 lignes max (`line-clamp-2`).
- Compteur de mots : badge discret `text-xs` (`{wordsCount} mots`) en bas, `text-neutral-400`.
- `FavoriteButton` positionné en haut à droite (`absolute top-3 right-3`).

**WordCard** — présente un mot dérivé :
- Le mot arabe diacrité en vedette : `font-arabic text-ar-xl font-bold text-neutral-900 dark:text-neutral-50`,
  `dir="rtl"`.
- À côté/dessous : `Badge` du `type` morphologique ; si `VERB`, `Badge` du `tense`.
- Translittération : `text-sm text-neutral-400 italic`.
- Schème (`pattern`) en arabe : `font-arabic text-ar-sm text-neutral-500 dark:text-neutral-400`,
  précédé d'un micro-label overline `text-2xs uppercase text-neutral-400` (« وزن / schème »).
- Traduction (`translationFr`) : `text-sm text-neutral-700 dark:text-neutral-300`.
- Exemple (`example`) si présent : `text-sm italic text-neutral-500` dans un encadré
  `bg-neutral-50 dark:bg-neutral-900 rounded-md p-3 border-l-2 border-accent-300 dark:border-accent-400/40`.
- `FavoriteButton` en haut à droite.

`FavoriteButton` : bouton icône cœur, `ghost`. Non favori = contour
`text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400`. Favori = cœur plein
`text-accent-600 dark:text-accent-400`. Micro-animation `scale-in` au toggle.

### 5.10 LetterPicker (grille de 28 lettres arabes)

Cœur de l'outil — sélection des 3 lettres d'une racine.

- **Grille** : `grid grid-cols-7 gap-2 sm:gap-2.5` (4 lignes × 7 = 28 lettres) ;
  sur très petit écran `grid-cols-6` accepté.
- **Cellule lettre (base)** :
  `aspect-square flex items-center justify-center rounded-lg font-arabic text-ar-lg font-semibold cursor-pointer transition-all duration-150 ease-snappy select-none`
- **Repos** :
  `bg-neutral-0 text-neutral-800 border border-neutral-200`
  `dark:bg-neutral-850 dark:text-neutral-200 dark:border-neutral-700`
- **Hover** :
  `hover:border-accent-300 hover:text-accent-700 hover:-translate-y-0.5`
  `dark:hover:border-accent-400/60 dark:hover:text-accent-300`
- **Sélectionnée (lettre faisant partie de la racine)** :
  `bg-accent-600 text-neutral-0 border-transparent shadow-accent-glow`
  (identique clair et sombre — pourpre plein).
- **Focus clavier** : `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400`.
- **Désactivée** (si une 4ᵉ sélection est tentée alors que 3 lettres sont déjà prises, selon
  la logique métier) : `opacity-40 pointer-events-none`.
- **Zone des 3 lettres choisies** (au-dessus de la grille) : 3 emplacements
  `h-20 w-20 rounded-xl border-2 border-dashed flex items-center justify-center font-arabic text-ar-lg`
  - Vide : `border-neutral-300 dark:border-neutral-600 text-neutral-300`.
  - Remplie : `border-accent-600 dark:border-accent-400 border-solid bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300`.
  - Disposition en `dir="rtl"` pour respecter l'ordre de lecture arabe.
- Chaque lettre nouvellement posée dans un emplacement : animation `scale-in`.
- Accessibilité : chaque cellule est un `<button>` avec `aria-pressed`, `aria-label`
  contenant le nom de la lettre.

---

## 6. Animations (framer-motion 11)

Principe : animer les **moments forts**, jamais tout. Mouvements courts, jamais de rebond
exagéré. Respecter `prefers-reduced-motion` (désactiver alors translations et scale, garder
de simples fondus).

### 6.1 Easings & durées de référence

| Nom | Courbe | Usage |
|-----|--------|-------|
| `soft` | `[0.22, 1, 0.36, 1]` | Entrées d'éléments, apparition de cartes |
| `snappy` | `[0.4, 0, 0.2, 1]` | Hover, micro-interactions, toggles |

| Type de mouvement | Durée |
|-------------------|-------|
| Micro-interaction (hover, toggle, focus) | 120–160 ms |
| Apparition d'un élément (carte, modale) | 220–320 ms |
| Transition de page | 280–360 ms |
| Décalage de cascade (`stagger`) entre cartes | 50–70 ms |

### 6.2 Transition de page (`AnimatePresence`)

Enrober les routes dans `<AnimatePresence mode="wait">`. Variants par page :

```js
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};
```

À appliquer dans `PageWrapper` sur un `motion.main`.

### 6.3 Apparition de cartes en cascade

Conteneur de grille = `motion.div` avec `staggerChildren` ; chaque carte = `motion.div` :

```js
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};
```

Utiliser `whileInView` (+ `viewport={{ once: true, margin: '-10%' }}`) pour les listes
longues afin de déclencher la cascade au scroll.

### 6.4 Hover & interactions

- Cartes : `whileHover={{ y: -2 }}` (la couleur de bordure/ombre est gérée en CSS Tailwind).
- Boutons : pas de `motion` requis — `active:scale-[0.98]` en CSS suffit.
- LetterPicker : `whileTap={{ scale: 0.94 }}` sur chaque cellule.
- Soulignement de NavLink actif : `layoutId="nav-underline"` pour un glissement fluide.
- Modale : entrée `scale-in` (overlay `fade-in`), sortie symétrique via `AnimatePresence`.

### 6.5 `prefers-reduced-motion`

Garde global recommandé :

```js
import { useReducedMotion } from 'framer-motion';
// si shouldReduce → ne fournir que { opacity } dans les variants, sans y ni scale.
```

---

## 7. Accessibilité & responsive

### 7.1 Contrastes — vérification du pourpre

Ratios WCAG (calcul sur luminance relative) :

| Combinaison | Ratio | Verdict |
|-------------|-------|---------|
| `accent-600 #6D28D9` sur blanc `#FFFFFF` | **6.0:1** | AA texte normal ✅ / AAA non |
| Blanc `#FFFFFF` sur `accent-600 #6D28D9` (bouton primary clair) | **6.0:1** | AA texte normal ✅ |
| `accent-600 #6D28D9` sur fond sombre `#141417` | 2.4:1 | ❌ ne pas utiliser pour du texte sur fond sombre |
| `accent-400 #A78BFA` sur fond sombre `#141417` | **6.9:1** | AA texte normal ✅ — c'est le token texte/lien en sombre |
| Blanc `#FFFFFF` sur `accent-600 #6D28D9` (bouton primary sombre) | **6.0:1** | AA ✅ |
| `text-primary` clair `#141417` sur blanc | 17.4:1 | AAA ✅ |
| `text-primary` sombre `#F7F7F8` sur `#141417` | 16.3:1 | AAA ✅ |
| `text-secondary` clair `#52525A` sur blanc | 7.6:1 | AAA ✅ |
| `text-secondary` sombre `#9A9AA1` sur `#141417` | 6.0:1 | AA ✅ |
| `text-muted` clair `#9A9AA1` sur blanc | 2.9:1 | ⚠️ texte non-essentiel uniquement (méta) |

**Règle normative tirée de ces ratios :** le pourpre **texte/lien** est `accent-600` en
thème clair et `accent-400` en thème sombre — ne jamais inverser. Le pourpre **surface
pleine** (`bg-accent-600` + texte blanc) est valide dans les deux thèmes. `text-muted` est
réservé aux informations non critiques.

### 7.2 Focus & navigation clavier

- Focus visible global défini en `:focus-visible` (§3.3) — ne jamais le retirer.
- Tous les éléments interactifs sont de vrais `<button>` / `<a>` / `<input>`.
- Modale : `focus-trap`, fermeture `Esc`, focus rendu à l'élément déclencheur à la fermeture.
- LetterPicker : navigation par flèches recommandée + `Entrée`/`Espace` pour sélectionner.
- Ordre de tabulation logique ; `aria-current="page"` sur le NavLink actif.
- Cibles tactiles ≥ 40×40 px (hauteur des boutons `md` = 44 px, conforme).

### 7.3 Sémantique & i18n

- Tout conteneur de texte arabe : `lang="ar"` + `dir="rtl"`. L'interface reste **LTR**
  (D4) ; seuls les blocs de contenu arabe sont RTL, isolés par `unicode-bidi: isolate`.
- Images/icônes décoratives : `aria-hidden="true"` ; icônes porteuses de sens : `aria-label`.
- Toasts (`react-hot-toast`) : `role="status"` (succès) / `role="alert"` (erreur).

### 7.4 Responsive — mobile-first

Breakpoints Tailwind standards (ne pas en ajouter) :

| Préfixe | Largeur min | Cible |
|---------|-------------|-------|
| (base)  | 0           | Mobile — point de départ |
| `sm:`   | 640 px      | Grand mobile / petite tablette |
| `md:`   | 768 px      | Tablette |
| `lg:`   | 1024 px     | Desktop |
| `xl:`   | 1280 px     | Grand desktop |

Conventions de mise en page :
- Largeur de contenu max : `max-w-7xl mx-auto` ; gouttières `px-4 sm:px-6 lg:px-8`.
- Grilles de cartes : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-4 sm:gap-6`.
- `LetterPicker` : `grid-cols-6` sur très petit écran, `grid-cols-7` dès `sm:`.
- Tailles arabes : descendre d'un cran sur mobile (ex. `text-ar-xl` → `text-ar-lg` via
  `text-ar-lg sm:text-ar-xl`).
- Navbar : menu hamburger sous `md:`, liens horizontaux à partir de `md:`.
- Espacement vertical de section : `py-12 sm:py-16 lg:py-24` — l'espace négatif est
  un parti pris, ne pas le réduire.

---

*Document de design system normatif — version 1.0. Toute implémentation frontend des
vagues suivantes doit s'y conformer strictement. Aucune couleur, taille, classe ou durée
ne doit être improvisée hors de ce document.*
