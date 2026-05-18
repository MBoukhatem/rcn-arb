// Page « À propos » — présentation éditoriale du projet et de la morphologie arabe.
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Badge from '@/components/ui/Badge';
import { WORD_TYPES, TYPE_META, getTypeLabel } from '@/utils/morphology';

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
    <PageWrapper title={t('about.title')} eyebrow="Manifeste · Méthode">
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-2 border-neutral-950 dark:border-neutral-0"
      >
        <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-neutral-950 dark:border-neutral-0 bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-8 sm:p-10 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <p className="relative text-2xs font-bold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
            — Introduction
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="relative mt-8 font-arabic text-6xl font-bold leading-tight"
          >
            الجذور الثلاثية
          </p>
          <p className="relative mt-4 text-2xs uppercase tracking-[0.24em] opacity-70">
            al-juḏūr aṯ-ṯulāṯiyya · trilateral roots
          </p>
        </div>
        <div className="lg:col-span-8 p-8 sm:p-12 bg-neutral-0 dark:bg-neutral-950">
          <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            {t('about.intro')}
          </p>

          <div className="mt-10 border-t border-neutral-300 dark:border-neutral-700 pt-8">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Morphologie
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
              {t('about.morphologyTitle')}
            </h2>
            <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
              {t('about.morphologyText')}
            </p>
          </div>

          <div className="mt-8 border-t border-neutral-300 dark:border-neutral-700 pt-8">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Audience
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
              {t('about.audienceTitle')}
            </h2>
            <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
              {t('about.audienceText')}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="mt-20">
        <header className="flex items-end justify-between gap-6 border-b-2 border-neutral-950 dark:border-neutral-0 pb-6">
          <div>
            <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
              — Typologie
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
              {t('morphology.title')}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-neutral-700 dark:text-neutral-300">
              {t('morphology.intro')}
            </p>
          </div>
          <span className="hidden sm:block font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {String(WORD_TYPES.length).padStart(2, '0')} types
          </span>
        </header>

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-neutral-950 dark:border-neutral-0"
        >
          {WORD_TYPES.map((code, i) => {
            const meta = TYPE_META[code];
            return (
              <motion.article
                key={code}
                variants={sectionVariants}
                className="-ml-px -mt-px border border-neutral-950 dark:border-neutral-0 p-6 bg-neutral-0 dark:bg-neutral-950 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-2xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-3xl font-bold text-neutral-950 dark:text-neutral-0"
                  >
                    {TYPE_EXAMPLES[code]}
                  </span>
                </div>
                <div className="mt-5">
                  <Badge accent={meta?.badgeAccent}>{getTypeLabel(code, t)}</Badge>
                </div>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-4 font-arabic text-base text-neutral-500 dark:text-neutral-400"
                >
                  {meta?.arabicName}
                </p>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
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
