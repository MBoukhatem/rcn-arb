// Hourglass — sablier SVG vectoriel.
// Symbole du temps et du sable arabe — clin d'œil aux racines anciennes de la
// langue qui ont traversé les siècles. Dessiné dans la palette du projet :
// cadre encre/turquoise, sable doré.
//
// Composition (viewBox 200×360) :
//   – Cadre rectangulaire fin (haut + bas)
//   – Deux triangles centraux formant les ampoules
//   – Sable doré dégradé qui remplit le haut, tombe en filet, s'accumule en bas
//   – Quelques grains stylisés qui flottent dans le passage central
import { motion } from 'framer-motion';

const Hourglass = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 360"
    className={className}
    aria-hidden="true"
    fill="none"
  >
    <defs>
      {/* Sable haut : doré plein vers le centre, plus lumineux en surface. */}
      <linearGradient id="sandTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5E4B6" />
        <stop offset="60%" stopColor="#E2BA5A" />
        <stop offset="100%" stopColor="#BE8A22" />
      </linearGradient>
      {/* Sable bas : amas légèrement plus foncé (sable tassé). */}
      <linearGradient id="sandBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D9A22B" />
        <stop offset="100%" stopColor="#9C701C" />
      </linearGradient>
      {/* Lueur dorée derrière le sablier (effet halo). */}
      <radialGradient id="glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#E2BA5A" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#E2BA5A" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Halo dorée derrière le sablier */}
    <circle cx="100" cy="180" r="130" fill="url(#glow)" />

    {/* ── Cadre haut : barre horizontale ── */}
    <rect
      x="20"
      y="20"
      width="160"
      height="8"
      className="fill-ink dark:fill-sand-100"
    />
    {/* ── Cadre bas : barre horizontale ── */}
    <rect
      x="20"
      y="332"
      width="160"
      height="8"
      className="fill-ink dark:fill-sand-100"
    />

    {/* ── Ampoule supérieure (triangle pointe en bas) — contour ── */}
    <path
      d="M 40 28 L 160 28 L 100 178 Z"
      className="stroke-ink dark:stroke-sand-100 fill-none"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* ── Ampoule inférieure (triangle pointe en haut) — contour ── */}
    <path
      d="M 40 332 L 160 332 L 100 182 Z"
      className="stroke-ink dark:stroke-sand-100 fill-none"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* ── Sable haut (qui descend) : triangle avec surface concave ──
        On dessine un triangle qui occupe la moitié haute du sablier supérieur. */}
    <path
      d="M 56 44 L 144 44 Q 144 56 138 64 L 100 168 Q 100 176 100 178 L 100 178 L 62 64 Q 56 56 56 44 Z"
      fill="url(#sandTop)"
    />

    {/* ── Filet de sable qui tombe au milieu ── */}
    <rect x="98.5" y="170" width="3" height="40" fill="#E2BA5A" />

    {/* ── Sable bas (qui s'accumule) : forme arrondie au fond du triangle ──
        Tas de sable doré qui monte en pyramide depuis la barre du bas. */}
    <path
      d="M 50 332 L 150 332 Q 150 310 130 290 Q 110 270 100 270 Q 90 270 70 290 Q 50 310 50 332 Z"
      fill="url(#sandBottom)"
    />

    {/* ── Grains qui flottent dans le passage central (5 petits points) ── */}
    <g fill="#E2BA5A">
      <circle cx="96" cy="185" r="1.5" />
      <circle cx="103" cy="195" r="1.2" />
      <circle cx="97" cy="210" r="1.4" />
      <circle cx="102" cy="225" r="1.2" />
      <circle cx="99" cy="240" r="1.5" />
    </g>

    {/* ── Reflet vertical fin sur le côté gauche de l'ampoule haute ── */}
    <path
      d="M 58 50 L 100 162"
      className="stroke-sand-50 dark:stroke-sand-50"
      strokeWidth="1.5"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />
  </svg>
);

// Version animée du sablier : légère oscillation et grains qui descendent.
// Décorative — désactivée si `prefers-reduced-motion`.
export const AnimatedHourglass = ({ className = '' }) => (
  <motion.div
    animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
    transition={{
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    }}
    className={className}
  >
    <Hourglass className="w-full h-full" />
  </motion.div>
);

export default Hourglass;
