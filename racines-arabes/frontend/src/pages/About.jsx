// Page « À propos » — présentation du projet et de la morphologie arabe.
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Ornament from '@/components/ui/Ornament';
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
      {/* ───────── Introduction ───────── */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      >
        <div className="lg:col-span-4 flex flex-col justify-center bg-accent-800 text-sand-50 p-8 sm:p-10">
          <p className="text-2xs font-bold uppercase tracking-[0.32em] text-sand-300">
            — Introduction
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="mt-6 font-arabic text-5xl font-bold leading-tight"
          >
            الجذور الثلاثية
          </p>
          <p className="mt-4 text-2xs uppercase tracking-[0.24em] text-sand-100/70">
            al-juḏūr aṯ-ṯulāṯiyya · trilateral roots
          </p>
        </div>
        <div className="lg:col-span-8 p-8 sm:p-12 bg-neutral-0 dark:bg-neutral-900">
          <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
            {t('about.intro')}
          </p>

          <div className="mt-10">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-600 dark:text-sand-300">
              — Morphologie
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('about.morphologyTitle')}
            </h2>
            <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
              {t('about.morphologyText')}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-600 dark:text-sand-300">
              — Audience
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('about.audienceTitle')}
            </h2>
            <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
              {t('about.audienceText')}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ───────── Les 7 types morphologiques ───────── */}
      <section className="mt-20">
        <div className="flex flex-col items-center text-center">
          <Ornament />
          <p className="mt-4 text-2xs font-bold uppercase tracking-[0.28em] text-accent-600 dark:text-sand-300">
            Typologie · {String(WORD_TYPES.length).padStart(2, '0')} types
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('morphology.title')}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-neutral-700 dark:text-neutral-300">
            {t('morphology.intro')}
          </p>
        </div>

        {/* Les 7 types sur une seule ligne */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-10 grid grid-cols-7 gap-2"
        >
          {WORD_TYPES.map((code, i) => {
            const meta = TYPE_META[code];
            return (
              <motion.article
                key={code}
                variants={sectionVariants}
                className="flex flex-col items-center text-center bg-neutral-0 dark:bg-neutral-900 border border-accent-700/40 dark:border-sand-300/30 px-2 py-5"
              >
                <span className="font-mono text-2xs font-bold tracking-[0.16em] text-sand-600 dark:text-sand-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="mt-3 font-arabic text-2xl sm:text-3xl font-bold text-accent-700 dark:text-accent-200"
                >
                  {TYPE_EXAMPLES[code]}
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="mt-2 font-arabic text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {meta?.arabicName}
                </span>
                <span className="mt-3 text-2xs font-bold uppercase leading-tight tracking-[0.12em] text-ink dark:text-neutral-0">
                  {getTypeLabel(code, t)}
                </span>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </PageWrapper>
  );
};

export default About;
