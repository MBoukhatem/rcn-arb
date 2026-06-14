# Design System — Dictionnaire de Racines Trilitères Arabes

> Document de référence normatif. Toutes les valeurs (HEX, classes, tailles, durées) ci-dessous
> sont **celles réellement utilisées dans le code**. Stack : React 18.3 + Vite 6 + Tailwind
> CSS 3.4 + framer-motion 11. `darkMode: 'class'` — la classe `dark` est posée sur `<html>`
> par `ThemeContext`.

---

## 1. Philosophie design

Inspiration **céramique persane et architecture islamique** : bleu turquoise profond,
crème froide, touches dorées. Pas un seul border-radius en dehors des pastilles parfaitement
rondes — l'interface est **strictement angulaire**, comme une mosaïque ou une page d'imprimerie
ancienne. Le contenu — texte arabe — est le héros. Les ornements (lettres flottantes, arches,
sablier) ponctuent le hero d'accueil sans encombrer les pages fonctionnelles.

Deux thèmes (clair / sombre) partagent la même grammaire. Le clair évoque le parchemin ; le
sombre évoque la nuit étoilée du désert.

---

## 2. Palette de couleurs (design tokens)

### 2.1 Échelle de neutres (`neutral`)

Du **crème froid** au **bleu turquoise très profond** — pas de gris standard, pas de noir pur.

| Token | HEX | Usage type |
|-------|-----|-----------|
| `neutral-0`   | `#FCFCFA` | Blanc cassé — fond clair, texte sur fond sombre |
| `neutral-50`  | `#F1F4F2` | Fond secondaire clair, hover de lignes |
| `neutral-100` | `#E2E8E6` | Surface clair, séparateurs doux |
| `neutral-200` | `#C8D2D0` | Bordures clair |
| `neutral-300` | `#A3B1B0` | Bordures fortes / disabled |
| `neutral-400` | `#7B8C8A` | Texte muted clair / texte secondaire sombre |
| `neutral-500` | `#52706F` | Texte secondaire clair |
| `neutral-600` | `#365453` | — |
| `neutral-700` | `#264140` | Bordures sombre |
| `neutral-800` | `#1B312F` | Surface sombre élevée |
| `neutral-850` | `#152826` | Fond secondaire sombre |
| `neutral-900` | `#102220` | Fond primaire sombre |
| `neutral-950` | `#0B1817` | Bleu turquoise quasi-noir — texte primaire clair |

### 2.2 Couleur d'accent — turquoise (`accent`)

Bleu turquoise sourd, hérité de la céramique d'Iznik.

| Token | HEX | Usage |
|-------|-----|-------|
| `accent-50`  | `#DDF0F1` | Halo très léger, fond hover discret |
| `accent-100` | `#B6DEE0` | Surface sélectionnée clair |
| `accent-200` | `#7FC3C7` | Bordure d'élément sélectionné |
| `accent-300` | `#4BA5AB` | **Accent sur fond sombre** (texte, icônes, liens) |
| `accent-400` | `#2A878E` | Accent intermédiaire |
| `accent-500` | `#1A7B8C` | Lien actif, hover |
| `accent-600` | `#136374` | Texte accent / bordures fortes |
| `accent-700` | `#0F4F5E` | **Accent principal** — navbar, surface CTA finale |
| `accent-800` | `#0B3B47` | Pressed profond, fond CTA final |
| `accent-900` | `#082A33` | Accent quasi-noir |

### 2.3 Échelle or doré — `sand`

Sable précieux. Utilisé pour les **ornements**, le **texte sur fond turquoise**, le **gradient
du titre hero**, et les statistiques numériques.

| Token | HEX | Usage |
|-------|-----|-------|
| `sand-50`  | `#FBF3DC` | Texte clair sur fond sombre (titres, liens navbar) |
| `sand-100` | `#F5E4B6` | Texte secondaire sur fond sombre |
| `sand-200` | `#EDD088` | Hover des CTA dorés |
| `sand-300` | `#E2BA5A` | **Doré principal** — CTA sur fond sombre, chiffres |
| `sand-400` | `#D9A22B` | Doré chaud |
| `sand-500` | `#BE8A22` | Doré sourd |
| `sand-600` | `#9C701C` | Doré profond |
| `sand-700` | `#785616` | — |
| `sand-800` | `#553D11` | — |
| `sand-900` | `#37280C` | Doré quasi-marron |

### 2.4 Encre & états

| Token | HEX | Rôle |
|-------|-----|------|
| `ink` | `#1E2A2E` | Texte primaire clair (jamais `#000000`) |
| `success-light` | `#136374` | Succès clair |
| `success-dark`  | `#7FC3C7` | Succès sombre |
| `error-light`   | `#A8442A` | Erreur clair (rouge brique) |
| `error-dark`    | `#E0926F` | Erreur sombre (rouge brûlé doux) |
| `warning-light` | `#9C701C` | Warning clair (doré sourd) |
| `warning-dark`  | `#EDD088` | Warning sombre (doré chaud) |

### 2.5 Tokens sémantiques — application

| Token sémantique | Classe clair | Classe sombre |
|------------------|--------------|----------------|
| Fond primaire | `bg-neutral-50` | `dark:bg-neutral-950` |
| Surface (carte) | `bg-neutral-0` | `dark:bg-neutral-900` |
| Bordure | `border-accent-700` | `dark:border-accent-300` |
| Bordure douce | `border-neutral-200` | `dark:border-neutral-800` |
| Texte primaire | `text-ink` | `dark:text-neutral-0` |
| Texte secondaire | `text-neutral-700` | `dark:text-neutral-300` |
| Texte muted | `text-neutral-500` | `dark:text-neutral-400` |
| Accent texte | `text-accent-600` | `dark:text-accent-300` |
| Accent fond | `bg-accent-700` | `dark:bg-accent-900` |
| Navbar (CTA / footer) | `bg-accent-700` | `dark:bg-accent-900` |
| Texte sur fond accent | `text-sand-50` ou `text-sand-100/70` | identique |

---

## 3. Configuration Tailwind

Le `tailwind.config.js` réel applique trois choix structurants :

```js
borderRadius: {
  none: '0', sm: '0', DEFAULT: '0', md: '0', lg: '0',
  xl: '0', '2xl': '0', '3xl': '0',
  full: '9999px',                    // conservé pour pastilles/avatars
},
boxShadow: {
  xs: 'none', sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none',
  modal: '0 24px 64px -12px rgba(0, 0, 0, 0.85)',
  'accent-glow': '0 0 0 2px rgba(26, 123, 140, 0.6)',
},
```

> **Règle d'or — pas de border-radius.** Toute l'UI est strictement angulaire (sauf pastilles
> rondes via `rounded-full`). Aucune utilisation de `rounded-md`, `rounded-lg` etc. — elles
> sont neutralisées en `0` dans la config. Les ombres standards sont **désactivées** : seules
> les modales utilisent une ombre, et l'effet de halo focal se fait via `accent-glow`.

### 3.1 Tailles typographiques

```js
fontSize: {
  '2xs':    ['0.6875rem', { lineHeight: '1rem',    letterSpacing: '0.08em' }],
  xs:       ['0.75rem',   { lineHeight: '1.125rem', letterSpacing: '0.06em' }],
  sm:       ['0.875rem',  { lineHeight: '1.375rem' }],
  base:     ['1rem',      { lineHeight: '1.625rem' }],
  lg:       ['1.125rem',  { lineHeight: '1.75rem' }],
  xl:       ['1.375rem',  { lineHeight: '1.875rem' }],
  '2xl':    ['1.75rem',   { lineHeight: '2.25rem',  letterSpacing: '-0.02em' }],
  '3xl':    ['2.5rem',    { lineHeight: '2.75rem',  letterSpacing: '-0.03em' }],
  '4xl':    ['3.5rem',    { lineHeight: '3.75rem',  letterSpacing: '-0.035em' }],
  '5xl':    ['4.5rem',    { lineHeight: '4.5rem',   letterSpacing: '-0.04em' }],
  '6xl':    ['6rem',      { lineHeight: '6rem',     letterSpacing: '-0.045em' }],
  // Échelle arabe — interligne plus généreux pour les hampes
  'ar-sm':   ['1.25rem',  { lineHeight: '2.25rem' }],
  'ar-base': ['1.625rem', { lineHeight: '2.75rem' }],
  'ar-lg':   ['2.5rem',   { lineHeight: '3.5rem'  }],
  'ar-xl':   ['3.75rem',  { lineHeight: '5rem'    }],
  'ar-hero': ['6rem',     { lineHeight: '7rem'    }],
},
```

### 3.2 Familles de polices

| Famille | Rôle | Classe Tailwind |
|---------|------|-----------------|
| **Inter** | UI latine, navigation, paragraphes FR/EN | `font-sans` (et `font-display`) |
| **Cairo** | Tout le contenu arabe (racines, mots, schèmes, picker) | `font-arabic` |
| **JetBrains Mono** | Slugs, codes, chiffres tabulaires, eyebrows | `font-mono` |

À charger via Google Fonts dans `index.html` :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cairo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

### 3.3 Trame graphique

Les fonds sombres immersifs utilisent une **trame en points** issue de la config :

```js
backgroundImage: {
  'grid-dot':       'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
  'grid-dot-light': 'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)',
},
backgroundSize: { 'grid-dot': '18px 18px' },
```

À utiliser sur des panneaux décoratifs (block « lettres en grand » du `RootDetail`).

### 3.4 Stratégie de thème

**Approche imposée :** variant `dark:` de Tailwind, **pas** de variables CSS sémantiques
applicatives. Chaque composant déclare son couple clair / sombre directement (`bg-neutral-0
dark:bg-neutral-900`). Cette règle aligne le code sur la doctrine `darkMode: 'class'` et évite
toute couche d'indirection (D8 — anti sur-ingénierie).

---

## 4. Typographie

### 4.1 Échelle latine (UI)

| Rôle | Classe Tailwind | Graisse |
|------|-----------------|---------|
| Hero d'accueil | `text-5xl` (mobile `text-4xl`) | `font-extrabold` (800) |
| Titre de page (H1) | `text-3xl sm:text-4xl` | `font-extrabold` |
| Titre de section (H2) | `text-2xl sm:text-3xl` | `font-extrabold` |
| Sous-titre (H3) | `text-xl` | `font-bold` (700) |
| Corps | `text-base` | `font-normal` (400) |
| Secondaire | `text-sm` | `font-normal` |
| Légende | `text-xs` | `font-medium` (500) |
| **Eyebrow / micro-label** | `text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300` | 600/700 |
| **Slug / chiffre mono** | `font-mono text-2xs uppercase tracking-[0.2em]` | 600 |

**Les "eyebrows"** (petites étiquettes en haut des sections, type `— SECTION 02`) sont
omniprésents. Toujours en `text-2xs` ou `text-xs`, `uppercase`, `tracking-[0.2em]` minimum,
généralement préfixés d'un tiret long `—` ou d'un chiffre `01·`.

### 4.2 Échelle arabe (contenu)

| Rôle | Classe Tailwind | Graisse |
|------|-----------------|---------|
| Racine en hero (`Home`, `RootDetail`) | `font-arabic text-[5rem] sm:text-[7rem]` | `font-bold` |
| Lettre du `LetterPicker` | `font-arabic text-2xl` à `text-3xl` (clamp) | `font-semibold` |
| Mot arabe en vedette (`WordCard`, fiches) | `font-arabic text-ar-xl` | `font-bold` |
| Racine en carte (`RootCard`) | `font-arabic text-ar-lg` | `font-semibold`/`font-bold` |
| Mot arabe en ligne / liste | `font-arabic text-ar-base` | `font-normal` |
| Schème / translittération arabe | `font-arabic text-ar-sm` | `font-normal` |

**Règles d'or pour le texte arabe :**
1. Toujours `dir="rtl"` et `lang="ar"` (ou la classe `.arabic`) sur le conteneur arabe.
2. Toujours `font-arabic` — jamais Inter sur de l'arabe.
3. Interligne large déjà intégré aux tokens `ar-*`.
4. La translittération latine (`k-t-b`) reste en `font-mono` ou `italic font-sans`, en `text-neutral-400`.
5. Ne jamais mettre l'arabe en `uppercase` ni en `tracking` négatif.

### 4.3 Anti-flash de thème — `index.html`

Avant le bundle, lire `localStorage.theme` et appliquer la classe `dark` sur `<html>`
synchroniquement.

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

Convention : chaque composant donne ses **classes Tailwind réelles**. Le couple clair / sombre
est toujours explicite.

### 5.1 Button (`components/ui/Button.jsx`)

Conteneur de base :
`inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.18em]
transition-all duration-150 focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300 disabled:opacity-50
disabled:pointer-events-none select-none`

Tailles :
- `sm` : `h-9 px-4 text-2xs`
- `md` (défaut) : `h-11 px-6 text-xs`
- `lg` : `h-13 px-8 text-xs`

| Variant | Clair | Sombre |
|---------|-------|--------|
| **primary** | `bg-accent-700 text-sand-50 hover:bg-accent-800` | `dark:bg-sand-300 dark:text-accent-900 dark:hover:bg-sand-200` |
| **secondary** | `bg-transparent text-ink border border-accent-700 hover:bg-accent-700 hover:text-sand-50` | `dark:text-neutral-0 dark:border-sand-300 dark:hover:bg-sand-300 dark:hover:text-accent-900` |
| **ghost** | `bg-transparent text-neutral-700 hover:text-accent-700` | `dark:text-neutral-300 dark:hover:text-sand-300` |
| **danger** | `bg-error-light text-sand-50 hover:bg-error-light/90` | `dark:bg-error-dark dark:text-ink dark:hover:bg-error-dark/90` |

> Le bouton **primary** porte la couleur d'accent dominante. Une seule action primaire par
> écran. La forme est **rectangulaire stricte** — aucun rayon.

### 5.2 Input (`components/ui/Input.jsx`)

Structure : `<label>` + `<input>` + zone de message.

- **Label** : `block text-2xs font-bold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2`.
- **Input** :
  `w-full h-11 px-4 text-sm bg-neutral-0 text-ink border border-neutral-300 placeholder:text-neutral-400`
  `dark:bg-neutral-900 dark:text-neutral-0 dark:border-neutral-700 dark:placeholder:text-neutral-500`
- **Focus** :
  `focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30`
  `dark:focus:border-accent-300 dark:focus:ring-accent-300/30`
- **État erreur** :
  `border-error-light dark:border-error-dark`
  message : `mt-2 text-2xs font-semibold uppercase tracking-[0.16em] text-error-light dark:text-error-dark`.
- **Disabled** : `opacity-60 cursor-not-allowed bg-neutral-50 dark:bg-neutral-850`.
- **Champ arabe** : ajouter `font-arabic text-ar-sm` + `dir="rtl"`.

### 5.3 Badge (`components/ui/Badge.jsx`)

Base : `inline-block px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap` (sans border-radius).

Tons :
- **Par défaut** (types morphologiques) : `bg-accent-700/12 dark:bg-accent-400/15 text-accent-700 dark:text-accent-300`.
- **Sélectionné / actif** : `bg-accent-700 text-sand-50 dark:bg-sand-300 dark:text-accent-900`.
- **Temps verbal** (MADI/MUDARI/AMR) : variante secondaire `bg-neutral-100 text-neutral-700 dark:bg-neutral-850 dark:text-neutral-300`.

### 5.4 Modal (`components/ui/Modal.jsx`)

Modale maison (pas de `@headlessui` — D2).

- **Overlay** : `fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm` — animation `fade-in`.
- **Conteneur de centrage** : `fixed inset-0 z-50 flex items-center justify-center p-4`.
- **Surface** :
  `w-full max-w-lg bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 shadow-modal` — animation `scale-in`.
- **En-tête** : `flex items-start justify-between px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800` — titre `text-xl font-bold tracking-tight`.
- **Corps** : `px-6 py-5 max-h-[70vh] overflow-y-auto`.
- **Pied** : `flex justify-end gap-3 px-6 pt-4 pb-6 border-t border-neutral-200 dark:border-neutral-800`.
- **Comportement** : fermeture sur `Esc` et clic overlay ; `focus-trap` interne ; `aria-modal="true"`, `role="dialog"`. `document.body` passe en `overflow-hidden` à l'ouverture.

### 5.5 Pagination (`components/ui/Pagination.jsx`)

Conteneur : `flex items-center justify-center gap-1.5`.

- **Bouton page** : `min-w-10 h-10 px-3 font-mono text-2xs font-bold tracking-[0.16em] border transition-colors`
  - Inactif : `bg-neutral-0 text-ink border-neutral-300 hover:bg-accent-700 hover:text-sand-50 hover:border-accent-700` + dark équivalent
  - **Actif** : `bg-accent-700 text-sand-50 border-accent-700 dark:bg-sand-300 dark:text-accent-900 dark:border-sand-300`
- **Préc / Suiv** : chevron + label optionnel, même style que inactif, `disabled:opacity-30 disabled:pointer-events-none`.

### 5.6 Spinner (`components/ui/Spinner.jsx`)

SVG cercle, `animate-spin-slow`. Couleur `text-accent-700 dark:text-accent-300` ; sur fond accent rempli : `text-sand-50`. Tailles : `sm`=`h-4 w-4`, `md`=`h-6 w-6`, `lg`=`h-9 w-9`. Track à `opacity-25`, arc à `opacity-100`.

### 5.7 ActionButtons (`components/ui/ActionButtons.jsx`)

Triplet d'icônes utilisé dans les **tableaux** (lignes de favoris, lignes de mots) :

| Composant | Icône | Couleur active |
|-----------|-------|----------------|
| `ViewButton` | œil | `accent-700` / `accent-300` |
| `EditButton` | crayon | `accent-700` / `accent-300` |
| `DeleteButton` | poubelle | `error-light` / `error-dark` |

Base commune : `inline-flex h-9 w-9 items-center justify-center border bg-neutral-0 text-ink border-neutral-950 hover:bg-sand-300 hover:text-accent-800` (et dark équivalent). Pas de border-radius. Pour `ViewButton`, c'est un `<Link>` (router), les autres sont des `<button>`.

### 5.8 EmptyState (`components/ui/EmptyState.jsx`)

État vide stylé. Props : `eyebrow`, `title`, `description?`, `action?`, `tone` (`default` / `error`).

Structure : eyebrow (`text-2xs uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300`) + titre (`text-2xl font-extrabold`) + description optionnelle + action (souvent un `<Button>` `primary`). Conteneur : `bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 px-6 py-16 text-center`.

### 5.9 BackLink (`components/ui/BackLink.jsx`)

Lien retour : `inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 hover:text-accent-700 dark:hover:text-sand-300` + chevron `←`.

### 5.10 Navbar (`components/layout/Navbar.jsx`)

- **Conteneur sticky** : `sticky top-0 z-40 w-full transition-colors duration-300`.
  - Sur la **Home** quand `scrollY < 16` : `bg-transparent backdrop-blur-0` (la navbar se superpose au hero sombre).
  - Sinon : `bg-accent-700/95 dark:bg-accent-900/95 backdrop-blur`.
- **Intérieur** : `mx-auto max-w-[1400px] h-16 px-4 sm:px-6 flex items-center justify-between gap-4`.
- **Marque** : à gauche, lettre arabe `ع` en `font-arabic text-2xl font-bold text-sand-200` + libellé `RACINES / ARABES` en deux lignes serrées.
- **Liens** : `text-2xs font-semibold uppercase tracking-[0.18em] px-3 py-2`
  - Inactif : `text-sand-100/70 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`
  - Actif : `text-sand-200` + soulignement `bg-sand-300` animé via `layoutId="nav-underline"`.
- **Toggle thème / langue** : boutons icône ghost dans les mêmes tons sable.
- **Menu utilisateur (avatar)** : dropdown avec liens `Profil` / `Favoris` / `Révisions`. Logout en variante `error`.
- **Mobile** (`< md`) : burger qui ouvre un panneau `motion.nav` plein-écran avec liens empilés.

### 5.11 Footer (`components/layout/Footer.jsx`)

`bg-accent-700 dark:bg-accent-900` plein, texte `text-sand-100`. Grande arche typographique
arabe `نظام الجذور` à gauche, deux colonnes de liens à droite (Index / Compte). Ligne du
copyright en bas, `text-2xs uppercase tracking-[0.3em] text-sand-300/70`.

### 5.12 PageWrapper (`components/layout/PageWrapper.jsx`)

Conteneur de page standard : `mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 lg:py-16` + `motion.main` avec `pageVariants` (cf. §6.2). Accepte `title` + `eyebrow` optionnels rendus en tête de page.

### 5.13 LetterPicker (`components/root/LetterPicker.jsx`)

**Composant central** — sélection des 3 lettres + **suggestion des lettres compatibles**.

- **Grille des 28 lettres arabes** : `dir="rtl" grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-14`, cellules `aspect-square` à `fontSize: clamp(0.875rem, 1.5vw, 1.25rem)`.
- **Cellule au repos** :
  `bg-neutral-0 text-ink hover:bg-neutral-950 hover:text-neutral-0 dark:bg-neutral-850 dark:text-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950`.
- **Cellule sélectionnée** (lettre faisant partie de la racine en cours) :
  `bg-accent-500 text-neutral-0 dark:bg-accent-300 dark:text-neutral-950`.
- **Cellule suggérée (D11)** — lettre qui complète une racine existante pour le slot actif :
  `bg-error-light/15 text-error-light border border-error-light hover:bg-error-light hover:text-sand-50 dark:bg-error-dark/20 dark:text-error-dark dark:border-error-dark dark:hover:bg-error-dark dark:hover:text-sand-50`.
- **Cellule désactivée** (si 3 lettres déjà posées et celle-ci n'en fait pas partie) : `opacity-30 pointer-events-none`.

Priorité de rendu : **sélectionnée > suggérée > au repos**.

**Slots des 3 lettres choisies** (au-dessus de la grille) :
- Vide : `text-neutral-300 dark:text-neutral-700 bg-neutral-0 dark:bg-neutral-850`.
- Remplie : `bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950`.
- Actif (slot que l'utilisateur va remplir) : ring `ring-2 ring-accent-500 dark:ring-accent-300 ring-offset-2`.

Tailles fluides : `slotSize: clamp(3rem, 5vw, 4.5rem)`. Disposition en `dir="rtl"` pour respecter l'ordre de lecture arabe.

### 5.14 RootCard (`components/root/RootCard.jsx`)

Carte de racine : `relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-6 transition-all duration-200`. Hover : `hover:bg-accent-700 hover:text-sand-50 dark:hover:bg-accent-600`. Affiche : eyebrow slug en `font-mono`, 3 lettres en `font-arabic text-ar-lg`, sens FR en `text-base`, compteur de mots en bas.

### 5.15 WordCard / WordTable (`components/word/WordCard.jsx`, `components/root/WordTable.jsx`)

`WordCard` : mot arabe en `font-arabic text-ar-xl text-accent-700 dark:text-accent-200`, badge type, translittération, traduction. `WordTable` : version tabulaire pour le `RootDetail` — colonnes Mot / Translittération / Type / Traduction / Actions, avec `ActionButtons`.

### 5.16 FavoriteButton (`components/favorites/FavoriteButton.jsx`)

Bouton carré sans radius : `inline-flex h-9 w-9 items-center justify-center border`.
- **Repos** : `bg-neutral-0 text-ink border-neutral-950 hover:bg-sand-300 hover:text-accent-800` (+ dark).
- **Actif** (favori) : `bg-error-light text-sand-50 border-error-light` (rouge brique).

Icône cœur SVG. Anim `scale-in` au toggle. Affiche un `Spinner sm` en chargement.

### 5.17 RevisionButton (`components/revisions/RevisionButton.jsx`)

Même morphologie que `FavoriteButton`, mais teinte **turquoise** pour ne pas se confondre avec le favori (rouge).
- **Repos** : identique à `FavoriteButton`.
- **Actif** (racine dans la liste de révision) : `bg-accent-700 text-sand-50 border-accent-700 dark:bg-accent-600`.

Icône « carte d'étude » : rectangle plein + barre supérieure.

### 5.18 RevisionStats (`components/revisions/RevisionStats.jsx`)

Bloc statistiques affiché **au-dessus** du tableau dans `/revisions`. Deux panneaux côte à côte :

1. **Score global** : grand chiffre `font-mono text-5xl font-extrabold text-accent-700 dark:text-accent-300` suivi de `/100`. Sous-titre `{{count}} cartes révisées au total`.
2. **Répartition par rating** : 4 colonnes (Raté / Difficile / Moyen / Facile), chaque chiffre en `font-mono text-2xl font-bold` avec couleur dédiée (cf. §5.19).

Conteneurs : `bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-6`. Eyebrow : `Stats · Mémorisation`.

### 5.19 Boutons de rating (`RevisionSession.jsx`)

4 boutons côte à côte affichés au **verso** de chaque carte de révision. Couleurs vives, sans radius, texte en blanc (sauf override) :

| Rating | Classe |
|--------|--------|
| `miss` (Raté) | `bg-error-light text-sand-50 border-error-light hover:bg-error-light/90` |
| `hard` (Difficile) | `bg-orange-500 text-sand-50 border-orange-500 hover:bg-orange-600` |
| `medium` (Moyen) | `bg-amber-500 !text-white border-amber-500 hover:bg-amber-600` |
| `easy` (Facile) | `bg-emerald-600 text-sand-50 border-emerald-600 hover:bg-emerald-700` |

Le `!text-white` force le contraste sur le fond ambre (jaune un peu clair). Hauteur `h-12`, police `text-2xs font-bold uppercase tracking-[0.2em]`.

### 5.20 Hero `Home` — ornements (`components/ui/`)

Composants décoratifs utilisés uniquement sur `Home` (et marginalement ailleurs) :

| Composant | Rôle |
|-----------|------|
| `FloatingLetters` | Constellation de lettres arabes éparpillées, réactives au hover (effet de répulsion à la souris). |
| `FloatingOrbs` | Petites sphères flottantes (fond du hero). |
| `Hourglass` | Sablier animé (titre « langue d'éternité »). |
| `AlphabetRail` | Rails verticaux défilants avec l'alphabet — marges gauche/droite, desktop only. |
| `Ornament` | Petite étoile dorée centrée sous une ligne — séparateur de section. |
| `PersianArch` | Arche persane stylisée — décor d'en-tête. |

Tous codés en SVG / framer-motion, `aria-hidden="true"` (purement décoratifs). À utiliser avec retenue : jamais sur des pages fonctionnelles (Profile, Search, RootExplorer).

---

## 6. Animations (framer-motion 11)

### 6.1 Easings & durées

| Nom | Courbe | Usage |
|-----|--------|-------|
| `ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrées d'éléments, apparitions |
| `ease-snappy` | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover, toggles, micro-interactions |

| Mouvement | Durée |
|-----------|-------|
| Micro-interaction | 120–160 ms |
| Apparition (carte, modale) | 200–320 ms |
| Transition de page | 280–360 ms |
| Stagger entre cartes | 50–70 ms |

### 6.2 Variants standards

```js
// PageWrapper
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,
             transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8,
             transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

// Grille en cascade
const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0,
             transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};
```

### 6.3 Interactions ciblées

- **NavLink actif** : soulignement `bg-sand-300` partagé entre routes via `layoutId="nav-underline"`.
- **Cartes** : `whileHover={{ y: -2 }}` (la couleur de bordure/fond se gère en CSS Tailwind).
- **LetterPicker** : `whileTap={{ scale: 0.92 }}` sur chaque cellule.
- **FavoriteButton / RevisionButton** : `AnimatePresence` avec `scale-in` lors du basculement.
- **Modale** : entrée `scale-in` (overlay `fade-in`), sortie symétrique via `AnimatePresence`.
- **Session de révision** : carte flip 3D — `rotateY` ±90° avec `perspective: 1500px` sur le conteneur ; `AnimatePresence mode="wait"` entre recto et verso.

### 6.4 `prefers-reduced-motion`

```js
import { useReducedMotion } from 'framer-motion';
// si shouldReduce → ne fournir que { opacity } dans les variants, sans y ni scale.
```

Appliqué partout où un mouvement non-essentiel pourrait gêner (cartes, picker, ornements).

---

## 7. Accessibilité & responsive

### 7.1 Contraste — pôles de la palette

| Combinaison | Ratio | Verdict |
|-------------|-------|---------|
| `ink #1E2A2E` sur `neutral-50 #F1F4F2` | 14:1 | AAA ✅ |
| `neutral-0 #FCFCFA` sur `neutral-950 #0B1817` | 18:1 | AAA ✅ |
| `accent-700 #0F4F5E` sur `neutral-0 #FCFCFA` | 8:1 | AAA ✅ |
| `accent-300 #4BA5AB` sur `neutral-950 #0B1817` | 6:1 | AA ✅ |
| `sand-300 #E2BA5A` sur `accent-900 #082A33` | 7:1 | AAA ✅ |
| `sand-50 #FBF3DC` sur `accent-700 #0F4F5E` | 9:1 | AAA ✅ |

**Règles :**
- Le pourpre n'existe plus — toutes les surfaces accent utilisent l'échelle turquoise.
- Sur **fond accent plein** (navbar, CTA final, footer), le texte est en **sand-50** ou **sand-300**.
- Sur **fond clair**, le texte accent utilise `accent-600` ou `accent-700` ; sur **fond sombre**, `accent-300`.

### 7.2 Focus & navigation clavier

- Focus visible global (toutes les pages) — ne jamais le retirer.
- Tous les éléments interactifs sont de vrais `<button>` / `<a>` / `<input>`.
- Modale : `focus-trap`, fermeture `Esc`, focus restauré à la fermeture.
- `LetterPicker` : tab + `Entrée`/`Espace` pour sélectionner ; `aria-pressed` sur chaque cellule.
- `aria-current="page"` sur le `NavLink` actif.
- Cibles tactiles ≥ 36×36 px (hauteur des boutons `md` = 44 px, des `sm` = 36 px).

### 7.3 Sémantique & i18n

- Tout conteneur de texte arabe : `lang="ar"` + `dir="rtl"`. L'interface reste **LTR** (D4) ; les blocs de contenu arabe sont isolés par `unicode-bidi: isolate`.
- Icônes décoratives : `aria-hidden="true"` ; icônes porteuses de sens : `aria-label`.
- Toasts (`react-hot-toast`) : `role="status"` (succès) / `role="alert"` (erreur).

### 7.4 Responsive — mobile-first

Breakpoints Tailwind standards :

| Préfixe | Largeur min | Cible |
|---------|-------------|-------|
| (base)  | 0           | Mobile |
| `sm:`   | 640 px      | Grand mobile / petite tablette |
| `md:`   | 768 px      | Tablette |
| `lg:`   | 1024 px     | Desktop |
| `xl:`   | 1280 px     | Grand desktop |

Conventions :
- Largeur max de contenu : `max-w-[1400px] mx-auto`, gouttières `px-4 sm:px-6 lg:px-10`.
- Grilles de cartes : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-4 sm:gap-6`.
- `LetterPicker` : `grid-cols-7` mobile, `sm:grid-cols-10`, `md:grid-cols-14`.
- Navbar : burger mobile sous `md:`, liens horizontaux dès `md:`.
- Espacement de section : `py-12 sm:py-16 lg:py-24` — l'espace négatif est un parti pris.

---

*Document normatif — version 2.0. Toute implémentation frontend doit s'y conformer. Aucune couleur, taille, classe ou durée ne doit être improvisée hors de ce document.*
