// RootCard — carte présentant une racine (3 lettres, sens, translittération).
// Design System §5.9.
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { joinLetters } from '@/utils/formatters';

const CARD_BASE =
  'group relative block rounded-xl border bg-neutral-0 dark:bg-neutral-850 ' +
  'border-neutral-200 dark:border-neutral-700 p-6 transition-all duration-200 ' +
  'ease-soft hover:border-accent-300 dark:hover:border-accent-400/50 ' +
  'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400';

/**
 * @param {object} props
 * @param {object} props.root - { slug, letters[], meaningFr, meaningEn, transliteration, wordsCount }
 * @param {string} [props.className]
 */
const RootCard = ({ root, className = '' }) => {
  const { t, i18n } = useTranslation();
  const shouldReduce = useReducedMotion();

  if (!root) return null;

  const isEnglish = i18n.language?.startsWith('en');
  const meaning = isEnglish
    ? (root.meaningEn ?? root.meaningFr)
    : (root.meaningFr ?? root.meaningEn);
  // Lettres : tableau `letters` ou dérivées du slug.
  const letters =
    root.letters ?? (root.slug ? root.slug.split('-') : []);

  return (
    <motion.div
      whileHover={shouldReduce ? undefined : { y: -2 }}
      transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/roots/${root.slug}`} className={`${CARD_BASE} ${className}`}>
        {/* Racine en grand, RTL */}
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-ar-lg font-semibold text-neutral-900 dark:text-neutral-50 text-center tracking-wide"
        >
          {joinLetters(letters)}
        </p>

        {/* Translittération latine */}
        {root.transliteration && (
          <p className="mt-1 text-center text-sm text-neutral-400 dark:text-neutral-500 italic">
            {root.transliteration}
          </p>
        )}

        {/* Sens */}
        {meaning && (
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 text-center">
            {meaning}
          </p>
        )}

        {/* Compteur de mots */}
        {typeof root.wordsCount === 'number' && (
          <p className="mt-4 text-center text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {t('root.wordsCount', { count: root.wordsCount })}
          </p>
        )}
      </Link>
    </motion.div>
  );
};

export default RootCard;
