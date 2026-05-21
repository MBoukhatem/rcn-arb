// FloatingLetters — constellation de lettres arabes éparpillées sur les
// BORDS du hero (zone centrale dégagée pour le titre/CTA).
//
// Chaque lettre flotte doucement (animation propre) et se décale vers le
// curseur en hover (effet de répulsion gravitationnelle).
//
// Décoratif : aria-hidden, pointer-events-none, select-none.
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const ARABIC_ALPHABET = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

// Définit la zone centrale interdite (où apparaissent titre + CTA) selon la
// largeur d'écran. Sur petits écrans, le titre prend ~100% de la largeur, donc
// l'exclusion en X disparaît et on garde uniquement des bandes haute/basse.
//
// breakpoint => { x1, x2, y1, y2 } en pourcentages
//   Toute lettre tombant dans [x1, x2] × [y1, y2] est repoussée vers un bord.
const getExclusion = (width) => {
  if (width < 768) {
    // Mobile : titre prend toute la largeur, seules les bandes haute/basse
    // sont disponibles.
    return { x1: 0, x2: 100, y1: 8, y2: 92 };
  }
  if (width < 1280) {
    // Tablette / petit desktop : zone d'exclusion large (titre encore long).
    return { x1: 8, x2: 92, y1: 12, y2: 88 };
  }
  // Desktop : zone centrale plus compacte, lettres tolérées sur les côtés.
  return { x1: 22, x2: 78, y1: 18, y2: 82 };
};

// Repousse une position (x, y) vers un bord disponible si elle tombe dans la
// zone interdite. Le choix du bord est déterministe (par index).
const pushToEdge = (x, y, i, excl) => {
  const inX = x > excl.x1 && x < excl.x2;
  const inY = y > excl.y1 && y < excl.y2;
  if (!inX || !inY) return { x, y };

  // Si la zone d'exclusion couvre toute la largeur (mobile), forcer haut/bas.
  // Sinon, on alterne entre les 4 côtés selon l'index.
  const isFullWidth = excl.x1 <= 0 && excl.x2 >= 100;
  if (isFullWidth) {
    return i % 2 === 0
      ? { x, y: ((i * 1.9) % Math.max(1, excl.y1)) }           // bande haute
      : { x, y: excl.y2 + ((i * 1.1) % Math.max(1, 100 - excl.y2)) }; // bande basse
  }

  const side = i % 4;
  if (side === 0) return { x: ((i * 1.7) % Math.max(1, excl.x1)), y };                 // gauche
  if (side === 1) return { x: excl.x2 + ((i * 1.3) % Math.max(1, 100 - excl.x2)), y }; // droite
  if (side === 2) return { x, y: ((i * 1.9) % Math.max(1, excl.y1)) };                 // haut
  return { x, y: excl.y2 + ((i * 1.1) % Math.max(1, 100 - excl.y2)) };                 // bas
};

// Génère pseudo-aléatoirement la distribution des lettres une seule fois.
// Positions déterministes pour stabilité entre re-renders React.
//
// Chaque lettre reçoit un `sizeScale` (0 → 1) : 0 = petite, 1 = grande.
// La taille réelle est calculée via `clamp(min, vw, max)` à l'affichage,
// pour que les lettres s'adaptent fluidement à la largeur de l'écran :
//   – mobile (< 640px)  : 0.7 – 1.6 rem
//   – tablette          : 0.9 – 2.4 rem
//   – desktop (1440+)   : 1.2 – 3.8 rem
//   – très grand écran  : peut monter au-delà via vw
const buildLetters = (count, viewportWidth) => {
  const excl = getExclusion(viewportWidth);
  const out = [];
  for (let i = 0; i < count; i++) {
    const palette = i % 3 === 0 ? 'sand' : 'accent';
    const rawX = 3 + ((i * 13.37) % 94);
    const rawY = 3 + ((i * 7.91 + 11) % 94);
    const { x, y } = pushToEdge(rawX, rawY, i, excl);

    // Facteur de taille (0 → 1). Détermine si la lettre est petite ou grande.
    const sizeScale = (i * 0.37) % 1;
    const opacity = 0.12 + ((i * 0.21) % 1) * 0.28;
    const floatDuration = 6 + ((i * 0.59) % 1) * 9;
    const floatAmplitude = 6 + ((i * 0.43) % 1) * 18;
    const floatDelay = (i * 0.29) % 4;

    out.push({
      id: i,
      char: ARABIC_ALPHABET[i % ARABIC_ALPHABET.length],
      x,
      y,
      sizeScale,
      opacity,
      palette,
      floatDuration,
      floatAmplitude,
      floatDelay,
    });
  }
  return out;
};

// Construit une taille de police responsive en `clamp(min, fluid, max)` :
//   – `min`   : taille plancher (petits écrans)
//   – `fluid` : taille intermédiaire qui suit `vw` (largeur viewport)
//   – `max`   : taille plafond (très grands écrans)
//
// Le `sizeScale` (0 → 1) multiplie chacune des bornes pour avoir des lettres
// proportionnellement plus ou moins grosses. Les valeurs ont été réduites
// pour que les lettres restent discrètes en arrière-plan, sans concurrencer
// le titre principal du hero.
const responsiveSize = (sizeScale) => {
  // Bornes pour la PLUS GRANDE lettre (sizeScale = 1)
  const minLarge = 0.7;   // rem — mobile
  const maxLarge = 2.4;   // rem — desktop XL
  // Bornes pour la PLUS PETITE lettre (sizeScale = 0)
  const minSmall = 0.4;   // rem — mobile
  const maxSmall = 0.8;   // rem — desktop XL

  const min = minSmall + (minLarge - minSmall) * sizeScale;
  const max = maxSmall + (maxLarge - maxSmall) * sizeScale;
  // Valeur fluide entre les deux, suivant la largeur du viewport.
  // Le coefficient `vw` est plus modeste (0.7vw au lieu de 1.2vw) pour que
  // la croissance avec la largeur d'écran reste contenue.
  const fluid = (min + max) / 2;
  return `clamp(${min}rem, ${fluid}rem + ${sizeScale * 0.7}vw, ${max}rem)`;
};

// Rayon (en pixels) de l'effet de répulsion autour du curseur.
const REPULSE_RADIUS = 180;
// Intensité max de répulsion (en px) appliquée à une lettre à distance 0.
const REPULSE_STRENGTH = 60;

// Détermine un "palier" de largeur d'écran (mobile / tablette / desktop) pour
// éviter de recalculer la distribution à chaque pixel de resize. Trois valeurs
// possibles : 0 (mobile), 1 (tablette), 2 (desktop).
const widthTier = (w) => (w < 768 ? 0 : w < 1280 ? 1 : 2);

const FloatingLetters = ({ count = 50 }) => {
  // Largeur du viewport mémorisée en "palier" pour ne reconstruire la
  // distribution que lorsqu'on change de breakpoint majeur (pas à chaque
  // resize fluide).
  const [tier, setTier] = useState(() =>
    typeof window === 'undefined' ? 2 : widthTier(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => {
      const next = widthTier(window.innerWidth);
      setTier((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Largeur effective utilisée pour calculer la zone d'exclusion. Les bornes
  // matchent celles de `widthTier` ci-dessus.
  const effectiveWidth = tier === 0 ? 600 : tier === 1 ? 1000 : 1440;
  const letters = useMemo(
    () => buildLetters(count, effectiveWidth),
    [count, effectiveWidth],
  );

  const containerRef = useRef(null);
  const [mouse, setMouse] = useState(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const handleMouseLeave = useCallback(() => setMouse(null), []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {letters.map((l) => (
        <LetterParticle key={l.id} letter={l} mouse={mouse} />
      ))}
    </div>
  );
};

// Une lettre isolée — flottement + répulsion souris.
const LetterParticle = ({ letter: l, mouse }) => {
  const ref = useRef(null);
  const [repulse, setRepulse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouse || !ref.current) {
      setRepulse({ x: 0, y: 0 });
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const parent = ref.current.offsetParent?.getBoundingClientRect();
    if (!parent) return;
    const cx = rect.left - parent.left + rect.width / 2;
    const cy = rect.top - parent.top + rect.height / 2;
    const dx = cx - mouse.x;
    const dy = cy - mouse.y;
    const dist = Math.hypot(dx, dy);

    if (dist > REPULSE_RADIUS) {
      setRepulse({ x: 0, y: 0 });
      return;
    }
    const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
    const angle = Math.atan2(dy, dx);
    setRepulse({
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
    });
  }, [mouse]);

  const colorClass =
    l.palette === 'sand' ? 'text-sand-300' : 'text-accent-300';

  return (
    <motion.span
      ref={ref}
      lang="ar"
      className={`absolute font-arabic font-bold leading-none ${colorClass}`}
      style={{
        left: `${l.x}%`,
        top: `${l.y}%`,
        fontSize: responsiveSize(l.sizeScale),
        opacity: l.opacity,
        willChange: 'transform',
      }}
      animate={{
        y: [
          repulse.y,
          repulse.y - l.floatAmplitude,
          repulse.y,
          repulse.y + l.floatAmplitude,
          repulse.y,
        ],
        x: repulse.x,
      }}
      transition={{
        y: {
          duration: l.floatDuration,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: l.floatDelay,
        },
        x: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {l.char}
    </motion.span>
  );
};

export default FloatingLetters;
