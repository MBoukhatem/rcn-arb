// WordList — liste éditoriale des mots dérivés groupés par type morphologique.
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getTypeLabel, groupWordsByType } from '@/utils/morphology';
import WordCard from '@/components/word/WordCard';
import EmptyState from '@/components/ui/EmptyState';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const WordList = ({ words = [], grouped = false, renderActions }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();

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

  const groups = grouped
    ? Array.isArray(words)
      ? words
      : []
    : groupWordsByType(Array.isArray(words) ? words : []);

  if (!groups || groups.length === 0) {
    return <EmptyState title={t('root.noWords')} />;
  }

  return (
    <div className="flex flex-col gap-16">
      {groups.map((group, gi) => (
        <section key={group.type} aria-label={getTypeLabel(group.type, t)}>
          <header className="mb-6 flex items-end justify-between gap-4 pb-3">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="font-mono text-2xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300">
                — {String(gi + 1).padStart(2, '0')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
                {getTypeLabel(group.type, t)}
              </h2>
              {group.meta?.arabicName && (
                <span
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-ar-sm text-neutral-500 dark:text-neutral-400"
                >
                  · {group.meta.arabicName}
                </span>
              )}
            </div>
            <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {String(group.words.length).padStart(2, '0')} entr.
            </span>
          </header>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {group.words.map((word) => (
              <motion.div
                key={word._id ?? word.id ?? word.arabic}
                variants={cardVariants}
              >
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
