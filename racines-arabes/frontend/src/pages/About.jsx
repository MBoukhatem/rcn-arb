// Page « À propos » — présentation du projet et de la morphologie arabe.
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Badge from '@/components/ui/Badge';
import { WORD_TYPES, TYPE_META, getTypeLabel } from '@/utils/morphology';

// Exemples (racine ك-ت-ب) par type morphologique.
const TYPE_EXAMPLES = {
  VERB: 'كَتَبَ',
  MASDAR: 'كِتَابَة',
  ACTIVE_PART: 'كَاتِب',
  PASSIVE_PART: 'مَكْتُوب',
  NOUN_PLACE: 'مَكْتَب',
  NOUN_TOOL: 'مِكْتَاب',
  ELATIVE: 'أَكْتَب',
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title={t('about.title')}>
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl"
      >
        <p className="text-lg text-neutral-700 dark:text-neutral-300">
          {t('about.intro')}
        </p>

        <div className="mt-12 space-y-3">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            {t('about.morphologyTitle')}
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            {t('about.morphologyText')}
          </p>
        </div>

        <div className="mt-12 space-y-3">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            {t('about.audienceTitle')}
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            {t('about.audienceText')}
          </p>
        </div>
      </motion.section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t('morphology.title')}
        </h2>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
          {t('morphology.intro')}
        </p>

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {WORD_TYPES.map((code) => {
            const meta = TYPE_META[code];
            return (
              <motion.article
                key={code}
                variants={sectionVariants}
                className="rounded-xl border border-neutral-200 bg-neutral-0 p-6 transition-all duration-200 ease-soft dark:border-neutral-700 dark:bg-neutral-850"
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge accent={meta?.badgeAccent}>{getTypeLabel(code, t)}</Badge>
                  <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-ar-base font-semibold text-neutral-900 dark:text-neutral-50"
                  >
                    {TYPE_EXAMPLES[code]}
                  </span>
                </div>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-3 font-arabic text-ar-sm text-neutral-500 dark:text-neutral-400"
                >
                  {meta?.arabicName}
                </p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {t(`morphology.typeDescription.${code}`)}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </PageWrapper>
  );
};

export default About;
