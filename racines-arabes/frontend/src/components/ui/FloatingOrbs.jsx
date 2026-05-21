// FloatingOrbs — sphères décoratives flottantes pour le hero immersif.
// Inspiré du design Cosmos (sphères en suspension) mais transposé dans la
// palette turquoise/sable du projet, avec calligraphie arabe en filigrane
// sur certaines sphères (clin d'œil aux racines de la langue).
//
// Composition : 6 sphères de tailles, positions et profondeurs variées qui
// flottent doucement (légère oscillation animée). Effet de halo radial pour
// une apparence de "planète" lumineuse.
import { motion } from 'framer-motion';

// Définition des sphères : position en %, taille en rem, palette, lettre
// arabe optionnelle au centre (filigrane décoratif).
const ORBS = [
  // Grande sphère turquoise en haut à gauche
  { top: '8%',  left: '4%',   size: 14, palette: 'accent', char: 'ا', delay: 0 },
  // Sphère moyenne dorée en haut à droite
  { top: '12%', right: '8%',  size: 10, palette: 'sand',   char: 'ب', delay: 1.2 },
  // Petite sphère turquoise au milieu gauche
  { top: '45%', left: '12%',  size: 7,  palette: 'accent', char: 'ت', delay: 0.6 },
  // Très grande sphère sombre en bas à droite (ancre visuelle)
  { top: '55%', right: '4%',  size: 18, palette: 'dark',   char: 'ك', delay: 1.8 },
  // Petite sphère dorée bas-gauche
  { top: '70%', left: '6%',   size: 8,  palette: 'sand',   char: null, delay: 0.9 },
  // Sphère moyenne turquoise centre-bas
  { top: '80%', left: '45%',  size: 9,  palette: 'accent', char: 'ر', delay: 1.5 },
];

// Couleurs par palette : gradient radial pour effet 3D + halo.
const PALETTES = {
  accent: {
    // Sphère turquoise avec lueur
    background:
      'radial-gradient(circle at 30% 30%, #2A878E 0%, #136374 50%, #082A33 100%)',
    glow: 'rgba(75, 165, 171, 0.35)',
  },
  sand: {
    // Sphère dorée avec lueur chaude
    background:
      'radial-gradient(circle at 30% 30%, #E2BA5A 0%, #9C701C 50%, #553D11 100%)',
    glow: 'rgba(226, 186, 90, 0.3)',
  },
  dark: {
    // Sphère encre/profonde avec reflet turquoise
    background:
      'radial-gradient(circle at 30% 30%, #264140 0%, #102220 50%, #0B1817 100%)',
    glow: 'rgba(15, 79, 94, 0.4)',
  },
};

const FloatingOrbs = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden select-none"
  >
    {ORBS.map((orb, i) => {
      const palette = PALETTES[orb.palette];
      const positionStyle = {
        top: orb.top,
        ...(orb.left ? { left: orb.left } : {}),
        ...(orb.right ? { right: orb.right } : {}),
        width: `${orb.size}rem`,
        height: `${orb.size}rem`,
      };
      return (
        <motion.div
          key={i}
          className="absolute"
          style={positionStyle}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -12, 0, 12, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: orb.delay * 0.3 },
            scale: { duration: 0.8, delay: orb.delay * 0.3, ease: [0.22, 1, 0.36, 1] },
            y: {
              duration: 8 + i,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: orb.delay,
            },
          }}
        >
          {/* Halo extérieur */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
              transform: 'scale(1.6)',
              filter: 'blur(8px)',
            }}
          />
          {/* Sphère principale */}
          <div
            className="relative w-full h-full rounded-full"
            style={{
              background: palette.background,
              boxShadow: `inset -15% -15% 30% rgba(0,0,0,0.4), inset 8% 8% 20% rgba(255,255,255,0.06)`,
            }}
          >
            {/* Lettre arabe en filigrane au centre */}
            {orb.char && (
              <span
                lang="ar"
                className="absolute inset-0 flex items-center justify-center font-arabic font-bold text-sand-50/15"
                style={{ fontSize: `${orb.size * 0.45}rem` }}
              >
                {orb.char}
              </span>
            )}
            {/* Reflet supérieur gauche */}
            <div
              className="absolute rounded-full"
              style={{
                top: '12%',
                left: '12%',
                width: '30%',
                height: '30%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default FloatingOrbs;
