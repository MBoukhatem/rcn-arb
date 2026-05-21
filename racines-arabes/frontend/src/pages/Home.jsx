// Page d'accueil — refonte inspirée de l'art persan.
// Palette : beige crème, vert olive, rose. Composition ornementale et centrée.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';
import PersianArch from '@/components/ui/PersianArch';
import Ornament from '@/components/ui/Ornament';
import AlphabetRail from '@/components/ui/AlphabetRail';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

// Dérivés de la racine ك-ت-ب pour la démonstration.
// `meaningKey` pointe sur une clé i18n résolue à l'affichage.
const KTB_DERIVED = [
  { ar: 'كَاتِب', tr: 'kātib', meaningKey: 'home.ktbWriter' },
  { ar: 'مَكْتَب', tr: 'maktab', meaningKey: 'home.ktbOffice' },
  { ar: 'كِتَاب', tr: 'kitāb', meaningKey: 'home.ktbBook' },
  { ar: 'كِتَابَة', tr: 'kitāba', meaningKey: 'home.ktbWriting' },
  { ar: 'مَكْتُوب', tr: 'maktūb', meaningKey: 'home.ktbWritten' },
  { ar: 'مَكْتَبَة', tr: 'maktaba', meaningKey: 'home.ktbLibrary' },
];

const Home = () => {
  const { t } = useTranslation();
  const features = [
    { title: t('home.feature1Title'), text: t('home.feature1') },
    { title: t('home.feature2Title'), text: t('home.feature2') },
    { title: t('home.feature3Title'), text: t('home.feature3') },
  ];

  return (
    <PageWrapper className="relative isolate">
      {/* Rails décoratifs : alphabet arabe défilant dans les marges (desktop only) */}
      <AlphabetRail side="left" />
      <AlphabetRail side="right" />

      {/* ═════════ HERO — composition centrée sous une arche persane ═════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center pt-4 pb-20"
      >
        <motion.h1
          variants={fadeUp}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.05] tracking-tight text-ink dark:text-neutral-0 whitespace-nowrap"
        >
          {t('home.heroTitle')}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-10 text-2xs font-bold uppercase tracking-[0.42em] text-sand-600 dark:text-sand-300"
        >
          نظام الجذور العربية
        </motion.p>

        {/* Arche persane encadrant la racine ك ت ب */}
        <motion.div variants={fadeUp} className="mt-8 w-full max-w-md">
          <PersianArch className="mx-auto h-[23rem] w-full text-accent-700 dark:text-accent-300">
            <div className="flex h-[23rem] flex-col items-center justify-center px-10">
              <span className="text-2xs font-semibold uppercase tracking-[0.34em] text-sand-600 dark:text-sand-300">
                {t('home.rootEyebrow')}
              </span>
              <span
                lang="ar"
                dir="rtl"
                className="mt-3 font-arabic text-5xl sm:text-6xl font-bold leading-[1.5] text-accent-700 dark:text-accent-200"
                style={{ whiteSpace: 'nowrap', letterSpacing: '0.08em' }}
              >
                كتب
              </span>
              <span className="mt-4 font-mono text-2xs uppercase tracking-[0.3em] text-ink/60 dark:text-neutral-300">
                k · t · b
              </span>
              <p className="mt-2 text-sm italic text-sand-600 dark:text-sand-300">
                {t('home.rootMeaning')}
              </p>
            </div>
          </PersianArch>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <Ornament />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-base sm:text-lg text-neutral-700 dark:text-neutral-300"
        >
          {t('home.heroSubtitle')}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Button as={Link} to="/explorer" variant="primary" size="lg">
            {t('home.cta')} →
          </Button>
          <Button as={Link} to="/about" variant="secondary" size="lg">
            {t('home.ctaSecondary')}
          </Button>
        </motion.div>

        {/* Statistiques */}
        <motion.dl
          variants={fadeUp}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 overflow-hidden bg-neutral-0 dark:bg-neutral-900 border border-accent-700/40 dark:border-sand-300/30 divide-x divide-accent-700/40 dark:divide-sand-300/30"
        >
          {[
            { key: 'home.statsRoots', v: '10K+' },
            { key: 'home.statsPatterns', v: '47' },
            { key: 'home.statsDerived', v: '∞' },
          ].map((s) => (
            <div
              key={s.key}
              className="flex flex-col items-center py-6"
            >
              <dt className="text-2xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {t(s.key)}
              </dt>
              <dd className="mt-2 font-arabic text-3xl font-bold text-accent-700 dark:text-accent-300">
                {s.v}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.section>

      {/* ═════════ FONCTIONNALITÉS ═════════ */}
      <section className="relative z-10 mt-12">
        <div className="flex flex-col items-center text-center">
          <Ornament />
          <p className="mt-5 text-2xs font-bold uppercase tracking-[0.3em] text-sand-600 dark:text-sand-300">
            {t('home.section02')}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('home.featuresTitle')}
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              className="group relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700/40 dark:border-sand-300/30 p-8 transition-colors duration-200 hover:bg-accent-700 dark:hover:bg-accent-600"
            >
              {/* Coin floral */}
              <span
                aria-hidden="true"
                className="absolute right-5 top-5 text-sand-400 dark:text-sand-300 group-hover:text-sand-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
                </svg>
              </span>
              <span className="font-mono text-2xs font-bold tracking-[0.22em] text-sand-600 dark:text-sand-300 group-hover:text-sand-200">
                {t('home.stepLabel')} {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-ink dark:text-neutral-0 group-hover:text-sand-50">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 group-hover:text-sand-100/90">
                {f.text}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ═════════ DÉMONSTRATION — racine ك-ت-ب et ses dérivés ═════════ */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-24"
      >
        <div className="flex flex-col items-center text-center">
          <Ornament />
          <p className="mt-5 text-2xs font-bold uppercase tracking-[0.3em] text-sand-600 dark:text-sand-300">
            {t('home.section03')}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('home.exampleTitle')}
          </h2>
          <p className="mt-4 max-w-xl text-base text-neutral-700 dark:text-neutral-300">
            {t('home.exampleText')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {KTB_DERIVED.map((w, i) => (
            <article
              key={w.tr}
              className="group flex flex-col items-center bg-neutral-0 dark:bg-neutral-900 border border-accent-700/40 dark:border-sand-300/30 px-4 py-7 text-center transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="font-mono text-2xs uppercase tracking-[0.2em] text-sand-500 dark:text-sand-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                lang="ar"
                dir="rtl"
                className="mt-3 font-arabic text-4xl font-bold text-accent-700 dark:text-accent-200"
              >
                {w.ar}
              </span>
              <span className="mt-2 font-mono text-2xs italic text-neutral-500 dark:text-neutral-400">
                {w.tr}
              </span>
              <span className="mt-3 text-2xs font-semibold uppercase tracking-[0.16em] text-sand-600 dark:text-sand-300">
                {t(w.meaningKey)}
              </span>
            </article>
          ))}
        </div>
      </motion.section>

      {/* ═════════ CTA FINAL ═════════ */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-24 bg-accent-800 px-6 py-16 sm:px-16 text-center"
      >
        <div className="flex flex-col items-center">
          <Ornament />
          <p className="mt-5 text-2xs font-bold uppercase tracking-[0.32em] text-sand-300">
            {t('home.ctaFinalEyebrow')}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-sand-50">
            {t('home.ctaFinalTitleStart')}{' '}
            <span className="text-sand-300">{t('home.ctaFinalTitleHighlight')}</span>.
          </h2>
          <p className="mt-5 max-w-xl text-base text-sand-100/80">
            {t('home.ctaFinalText')}
          </p>
          <Button
            as={Link}
            to="/explorer"
            variant="primary"
            size="lg"
            className="mt-9 !bg-sand-300 !text-accent-900 hover:!bg-sand-200"
          >
            {t('home.ctaFinalButton')} →
          </Button>
        </div>
      </motion.section>
    </PageWrapper>
  );
};

export default Home;
