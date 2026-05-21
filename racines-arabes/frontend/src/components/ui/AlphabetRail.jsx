// AlphabetRail — lettres arabes éparpillées dans les marges latérales du Home.
// Composition artistique avec effet PARALLAX au scroll : chaque lettre se
// déplace à sa propre vitesse (plus c'est rapide, plus la lettre paraît
// "proche") créant une sensation de profondeur sur 3 plans.
//
// Décoratif : `aria-hidden`, `pointer-events-none`, `select-none`, désactivé
// sous lg:. Le décor vit dans son parent `relative` (PageWrapper).
//
// Adaptation responsive : chaque lettre est positionnée en `calc()` à partir
// de `100vw` afin que les marges se peuplent toutes seules quand la fenêtre
// s'élargit. Sur écran étroit (< CONTENT_MAX), les lettres se collent au bord
// du contenu grâce au `max(0px, …)`.
//
// Accessibilité : si l'utilisateur a activé `prefers-reduced-motion`, le
// parallax est désactivé — composition statique.
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Largeur max du contenu centré (PageWrapper).
const CONTENT_MAX = '1400px';

// Marge libre extérieure de chaque côté, valeur dynamique :
//   externalGap = max(0px, (100vw - CONTENT_MAX) / 2)
// Sert d'ancre depuis laquelle on place les lettres vers l'intérieur des bords.
const externalGap = `max(0px, (100vw - ${CONTENT_MAX}) / 2)`;

// Définit la position et le style de chaque lettre.
//   char     : lettre arabe
//   side     : 'left' | 'right'
//   xRatio   : 0 = bord du viewport · 1 = bord intérieur du PageWrapper
//   topPct   : position verticale en % de la hauteur du parent
//   size     : taille typographique (rem)
//   opacity  : opacité (0–1)
//   palette  : 'accent' (turquoise) | 'sand' (doré)
//   speed    : vitesse de parallax (négatif = monte plus vite que le scroll,
//              positif = monte plus lentement / suit la page).
//              Plage typique [-0.4 ; 0.4]. 0 = pas de parallax.
const LETTERS = [
  // ── Colonne gauche
  { char: 'ا', side: 'left',  xRatio: 0.55, topPct: 6,  size: 4.5, opacity: 0.10, palette: 'sand',   speed: -0.03 },
  { char: 'ب', side: 'left',  xRatio: 0.20, topPct: 14, size: 2.5, opacity: 0.06, palette: 'accent', speed:  0.02 },
  { char: 'ج', side: 'left',  xRatio: 0.75, topPct: 22, size: 3.2, opacity: 0.08, palette: 'accent', speed: -0.02 },
  { char: 'د', side: 'left',  xRatio: 0.35, topPct: 30, size: 2.0, opacity: 0.05, palette: 'sand',   speed:  0.03 },
  { char: 'ر', side: 'left',  xRatio: 0.65, topPct: 39, size: 5.5, opacity: 0.11, palette: 'sand',   speed: -0.04 },
  { char: 'س', side: 'left',  xRatio: 0.15, topPct: 47, size: 2.2, opacity: 0.05, palette: 'accent', speed:  0.02 },
  { char: 'ص', side: 'left',  xRatio: 0.50, topPct: 55, size: 3.0, opacity: 0.07, palette: 'accent', speed: -0.02 },
  { char: 'ط', side: 'left',  xRatio: 0.80, topPct: 63, size: 4.0, opacity: 0.09, palette: 'sand',   speed:  0.03 },
  { char: 'ع', side: 'left',  xRatio: 0.25, topPct: 71, size: 2.8, opacity: 0.06, palette: 'sand',   speed: -0.02 },
  { char: 'ف', side: 'left',  xRatio: 0.60, topPct: 79, size: 3.5, opacity: 0.08, palette: 'accent', speed:  0.02 },
  { char: 'ل', side: 'left',  xRatio: 0.40, topPct: 87, size: 2.4, opacity: 0.05, palette: 'sand',   speed: -0.03 },
  { char: 'م', side: 'left',  xRatio: 0.70, topPct: 92, size: 3.8, opacity: 0.08, palette: 'accent', speed:  0.01 },

  // ── Colonne droite (positions différentes, pas un miroir, pour éviter la symétrie)
  { char: 'ن', side: 'right', xRatio: 0.70, topPct: 4,  size: 3.2, opacity: 0.08, palette: 'accent', speed:  0.03 },
  { char: 'ه', side: 'right', xRatio: 0.35, topPct: 12, size: 2.4, opacity: 0.06, palette: 'sand',   speed: -0.02 },
  { char: 'و', side: 'right', xRatio: 0.55, topPct: 20, size: 5.0, opacity: 0.10, palette: 'sand',   speed:  0.04 },
  { char: 'ي', side: 'right', xRatio: 0.20, topPct: 28, size: 2.8, opacity: 0.06, palette: 'accent', speed: -0.02 },
  { char: 'ش', side: 'right', xRatio: 0.78, topPct: 37, size: 3.6, opacity: 0.08, palette: 'accent', speed:  0.02 },
  { char: 'ث', side: 'right', xRatio: 0.40, topPct: 45, size: 2.2, opacity: 0.05, palette: 'sand',   speed: -0.03 },
  { char: 'ق', side: 'right', xRatio: 0.62, topPct: 53, size: 4.2, opacity: 0.09, palette: 'sand',   speed:  0.02 },
  { char: 'خ', side: 'right', xRatio: 0.25, topPct: 61, size: 3.0, opacity: 0.07, palette: 'accent', speed: -0.03 },
  { char: 'ح', side: 'right', xRatio: 0.55, topPct: 69, size: 2.6, opacity: 0.06, palette: 'sand',   speed:  0.02 },
  { char: 'ك', side: 'right', xRatio: 0.75, topPct: 77, size: 3.4, opacity: 0.08, palette: 'accent', speed: -0.02 },
  { char: 'ت', side: 'right', xRatio: 0.30, topPct: 85, size: 4.5, opacity: 0.09, palette: 'sand',   speed:  0.04 },
  { char: 'ذ', side: 'right', xRatio: 0.60, topPct: 92, size: 2.6, opacity: 0.06, palette: 'accent', speed: -0.01 },
];

// Convertit (side, xRatio) en couple { left | right } CSS.
//   xRatio = 0 : tout contre le bord du viewport (à l'extérieur du PageWrapper)
//   xRatio = 1 : juste à l'intérieur du PageWrapper
//
// Le décalage doit être NÉGATIF (la lettre sort du PageWrapper vers le bord
// du viewport). On l'exprime avec une multiplication par -1 en tête pour que
// CSS l'accepte sans ambiguïté : `calc(-1 * (1 - xRatio) * externalGap)`.
const positionStyle = ({ side, xRatio }) => {
  const offset = `calc(-1 * ${1 - xRatio} * ${externalGap})`;
  return side === 'left' ? { left: offset } : { right: offset };
};

// Couleurs Tailwind par palette.
const COLOR_CLASS = {
  accent: 'text-accent-700 dark:text-accent-300',
  sand: 'text-sand-500 dark:text-sand-300',
};

// Une lettre individuelle avec son propre calcul de parallax.
// Découpée pour avoir un hook `useTransform` par instance (règles des hooks).
const ParallaxLetter = ({ letter, scrollY, animated }) => {
  // translateY = -scrollY * speed (négatif pour que les lettres remontent
  // plus vite que la page quand on scrolle vers le bas, donnant l'illusion
  // qu'elles sont "devant" — comportement parallax classique).
  // Plage [-Infinity, Infinity] mais en pratique bornée par la hauteur de page.
  const y = useTransform(scrollY, (s) => (animated ? -s * letter.speed : 0));

  return (
    <motion.span
      lang="ar"
      className={`absolute font-arabic font-bold leading-none ${COLOR_CLASS[letter.palette]}`}
      style={{
        ...positionStyle(letter),
        top: `${letter.topPct}%`,
        fontSize: `${letter.size}rem`,
        opacity: letter.opacity,
        y,
        // Optimisation GPU : signale au navigateur que `transform` va changer
        // souvent, l'incite à promouvoir l'élément sur sa propre couche.
        willChange: animated ? 'transform' : 'auto',
      }}
    >
      {letter.char}
    </motion.span>
  );
};

// Le composant accepte une prop `side` pour compatibilité avec l'usage actuel
// (Home rend <AlphabetRail side="left" /> puis <AlphabetRail side="right" />).
// On filtre la liste sur ce côté pour ne pas doublonner les lettres.
const AlphabetRail = ({ side = 'left' }) => {
  const shouldReduce = useReducedMotion();
  // `useScroll` retourne une MotionValue `scrollY` qui se met à jour à chaque
  // événement de scroll, hors cycle React (pas de re-render).
  const { scrollY } = useScroll();
  const lettersForSide = LETTERS.filter((l) => l.side === side);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block select-none"
    >
      {lettersForSide.map((letter, i) => (
        <ParallaxLetter
          key={`${letter.char}-${i}`}
          letter={letter}
          scrollY={scrollY}
          animated={!shouldReduce}
        />
      ))}
    </div>
  );
};

export default AlphabetRail;
