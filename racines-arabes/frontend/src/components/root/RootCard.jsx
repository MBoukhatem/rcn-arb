// RootCard — carte de racine éditoriale, bordure dure, hover inversion.
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { joinLetters } from '@/utils/formatters';

const CARD_BASE =
  'group relative block bg-neutral-0 dark:bg-neutral-950 ' +
  'border border-neutral-950 dark:border-neutral-0 ' +
  'p-6 transition-colors duration-200 ' +
  'hover:bg-neutral-950 hover:text-neutral-0 ' +
  'dark:hover:bg-neutral-0 dark:hover:text-neutral-950 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300';

const RootCard = ({ root, className = '' }) => {
  const { t, i18n } = useTranslation();
  const shouldReduce = useReducedMotion();

  if (!root) return null;

  const isEnglish = i18n.language?.startsWith('en');
  const meaning = isEnglish
    ? (root.meaningEn ?? root.meaningFr)
    : (root.meaningFr ?? root.meaningEn);
  const letters = root.letters ?? (root.slug ? root.slug.split('-') : []);

  return (
    <motion.div
      whileHover={shouldReduce ? undefined : { y: -2 }}
      transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/roots/${root.slug}`} className={`${CARD_BASE} ${className}`}>
        {/* Corner ID */}
        <span className="font-mono text-2xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300 group-hover:text-accent-300 dark:group-hover:text-accent-500">
          [ {root.slug ?? 'root'} ]
        </span>

        {/* Racine en grand */}
        <p
          lang="ar"
          dir="rtl"
          className="mt-4 font-arabic text-5xl font-bold text-center tracking-wide"
        >
          {joinLetters(letters)}
        </p>

        {/* Filet */}
        <span className="block mt-4 h-px w-full bg-current opacity-30" aria-hidden="true" />

        {root.transliteration && (
          <p className="mt-3 text-center text-xs italic opacity-70">
            {root.transliteration}
          </p>
        )}

        {meaning && (
          <p className="mt-2 text-sm line-clamp-2 text-center">
            {meaning}
          </p>
        )}

        {typeof root.wordsCount === 'number' && (
          <p className="mt-5 text-center font-mono text-2xs uppercase tracking-[0.2em] opacity-70">
            {t('root.wordsCount', { count: root.wordsCount })}
          </p>
        )}

        <span aria-hidden="true" className="absolute bottom-3 right-3 text-2xs font-bold">
          →
        </span>
      </Link>
    </motion.div>
  );
};

export default RootCard;
