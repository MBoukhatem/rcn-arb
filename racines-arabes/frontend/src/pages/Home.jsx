// Page d'accueil — landing / présentation du projet.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// Quelques dérivés de la racine ك-ت-ب pour l'exemple visuel.
const KTB_DERIVED = [
  { ar: 'كَاتِب', tr: 'kātib' },
  { ar: 'مَكْتَب', tr: 'maktab' },
  { ar: 'كِتَاب', tr: 'kitāb' },
  { ar: 'كِتَابَة', tr: 'kitāba' },
  { ar: 'مَكْتُوب', tr: 'maktūb' },
];

const Home = () => {
  const { t } = useTranslation();
  const features = [
    { title: t('home.feature1Title'), text: t('home.feature1') },
    { title: t('home.feature2Title'), text: t('home.feature2') },
    { title: t('home.feature3Title'), text: t('home.feature3') },
  ];

  return (
    <PageWrapper>
      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center"
      >
        <motion.span
          variants={fadeUp}
          lang="ar"
          dir="rtl"
          className="font-arabic text-ar-hero font-bold text-accent-600 dark:text-accent-400"
        >
          ك ت ب
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="mt-6 max-w-3xl text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-neutral-50"
        >
          {t('home.heroTitle')}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400"
        >
          {t('home.heroSubtitle')}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/explorer" variant="primary" size="lg">
            {t('home.cta')}
          </Button>
          <Button as={Link} to="/about" variant="secondary" size="lg">
            {t('home.ctaSecondary')}
          </Button>
        </motion.div>
      </motion.section>

      {/* Fonctionnalités */}
      <section className="mt-24">
        <h2 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t('home.featuresTitle')}
        </h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {features.map((f) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              className="rounded-xl border border-neutral-200 bg-neutral-0 p-6 dark:border-neutral-700 dark:bg-neutral-850"
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {f.text}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Exemple visuel */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-24 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-12 dark:border-neutral-700 dark:bg-neutral-850"
      >
        <h2 className="text-center text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t('home.exampleTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-neutral-600 dark:text-neutral-400">
          {t('home.exampleText')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {KTB_DERIVED.map((w) => (
            <div
              key={w.tr}
              className="flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-0 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <span
                lang="ar"
                dir="rtl"
                className="font-arabic text-ar-base font-semibold text-neutral-900 dark:text-neutral-50"
              >
                {w.ar}
              </span>
              <span className="mt-1 text-xs italic text-neutral-400 dark:text-neutral-500">
                {w.tr}
              </span>
            </div>
          ))}
        </div>
      </motion.section>
    </PageWrapper>
  );
};

export default Home;
