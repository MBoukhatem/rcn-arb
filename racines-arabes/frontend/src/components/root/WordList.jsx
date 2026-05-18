// WordList — liste des mots dérivés groupés par type morphologique.
// Design System §6.3 (apparition en cascade).
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getTypeLabel, groupWordsByType } from '@/utils/morphology';
import WordCard from '@/components/word/WordCard';

// Variants de cascade (§6.3).
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/**
 * @param {object} props
 * @param {Array} props.words - tableau de mots OU tableau de groupes si `grouped`.
 * @param {boolean} [props.grouped=false] - true si `words` est déjà groupé.
 * @param {Function} [props.renderActions] - (word) => noeud d'actions par carte.
 */
const WordList = ({ words = [], grouped = false, renderActions }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();

  // Carte : variants réduits si prefers-reduced-motion.
  const cardVariants = shouldReduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
        },
      };

  // Normalise l'entrée : groupe localement si nécessaire.
  const groups = grouped ? words : groupWordsByType(words);

  if (!groups || groups.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-400 dark:text-neutral-500">
        {t('root.noWords')}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.type} aria-label={getTypeLabel(group.type, t)}>
          {/* Titre de section : libellé traduit + nom arabe */}
          <header className="mb-5 flex items-baseline gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {getTypeLabel(group.type, t)}
            </h2>
            {group.meta?.arabicName && (
              <span
                lang="ar"
                dir="rtl"
                className="font-arabic text-ar-sm text-neutral-400 dark:text-neutral-500"
              >
                {group.meta.arabicName}
              </span>
            )}
            <span className="ml-auto text-xs font-medium text-neutral-400 dark:text-neutral-500">
              {t('root.wordsCount', { count: group.words.length })}
            </span>
          </header>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {group.words.map((word) => (
              <motion.div key={word._id ?? word.id ?? word.arabic} variants={cardVariants}>
                <WordCard
                  word={word}
                  actions={renderActions ? renderActions(word) : undefined}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
};

export default WordList;
