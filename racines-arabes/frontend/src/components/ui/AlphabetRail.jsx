// AlphabetRail — colonne verticale décorative en marge de page.
// Empile les 28 lettres de l'alphabet arabe, défilement infini doux.
// Décoratif : masqué aux lecteurs d'écran et désactivé sous lg:.
//
// Positionnement : `absolute` à l'intérieur d'un parent `relative`.
// Le rail vit DANS son parent, donc il s'arrête naturellement avant le footer
// et ne reste pas collé au viewport quand on scrolle.
import { useReducedMotion } from 'framer-motion';

const ARABIC_ALPHABET = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

const AlphabetRail = ({ side = 'left' }) => {
  const shouldReduce = useReducedMotion();
  const isLeft = side === 'left';

  const animationClass = shouldReduce
    ? ''
    : isLeft
      ? 'animate-marquee-y'
      : 'animate-marquee-y-reverse';

  const positionClass = isLeft ? '-left-16 xl:-left-24' : '-right-16 xl:-right-24';
  const fadeMask =
    'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 ${positionClass} z-0 hidden lg:block w-20 xl:w-28 overflow-hidden`}
      style={{
        WebkitMaskImage: fadeMask,
        maskImage: fadeMask,
      }}
    >
      <div
        className={`flex flex-col ${animationClass}`}
        style={{ willChange: 'transform' }}
      >
        {/* Liste dupliquée → boucle infinie sur translateY(-50%) sans saut.
            Hauteur d'item FIXE (h-24) pour que le cycle tombe pile et pour
            l'espacement entre lettres. */}
        {[...ARABIC_ALPHABET, ...ARABIC_ALPHABET].map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            lang="ar"
            className="flex h-24 items-center justify-center font-arabic text-2xl xl:text-3xl font-semibold leading-none text-accent-700/15 dark:text-sand-300/15 select-none"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AlphabetRail;
