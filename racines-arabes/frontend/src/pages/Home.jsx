// Page d'accueil — refonte inspirée de l'art persan.
// Palette : beige crème, vert olive, rose. Composition ornementale et centrée.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';
import Ornament from '@/components/ui/Ornament';
import AlphabetRail from '@/components/ui/AlphabetRail';
import FloatingLetters from '@/components/ui/FloatingLetters';

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
    <>
      {/* ═════════ HERO — composition immersive style Cosmos, full-bleed ═════
          Hors PageWrapper : occupe TOUTE la largeur du viewport.
          `-mt-16` fait remonter le hero SOUS la navbar pour que celle-ci, en
          mode transparent (page d'accueil, scroll = 0), se superpose sur le
          fond sombre du hero — pas sur le fond clair du body. */}
      <div className="relative bg-neutral-950 dark:bg-neutral-950 overflow-hidden w-full -mt-16 pt-16 min-h-screen flex flex-col">
        {/* Constellation de lettres arabes éparpillées sur les bords, réactives
            au survol de la souris (effet de répulsion). Centre dégagé pour le
            titre et les CTA. */}
        <FloatingLetters count={50} />

        {/* Voile dégradé radial pour adoucir le fond derrière le titre */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(15, 79, 94, 0.5) 0%, transparent 70%)',
          }}
        />

        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 flex flex-1 flex-col items-center justify-center text-center py-12 gap-5"
        >
          {/* Eyebrow — petit label en haut, façon "WELCOME TO COSMOS" */}
          <motion.p
            variants={fadeUp}
            className="text-2xs font-bold uppercase tracking-[0.42em] text-sand-300/70"
          >
            {t('home.heroEyebrow')}
          </motion.p>

          {/* Titre monumental — gradient crème → sable doré, façon Cosmos */}
          <motion.h1
            variants={fadeUp}
            className="max-w-5xl font-extrabold leading-[0.95] tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
            }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #FBF3DC 0%, #F5E4B6 35%, #E2BA5A 100%)',
              }}
            >
              {t('home.heroTitle')}
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-sm sm:text-base leading-relaxed text-sand-100/75"
          >
            {t('home.heroSubtitle')}
          </motion.p>

          {/* CTA — deux boutons centrés. Effet d'agrandissement au survol. */}
          <motion.div
            variants={fadeUp}
            className="mt-2 flex flex-wrap justify-center gap-3"
          >
            <Button
              as={Link}
              to="/explorer"
              variant="primary"
              size="lg"
              className="!bg-sand-300 !text-accent-900 hover:!bg-sand-200 hover:scale-105 transition-transform duration-200 origin-center"
            >
              {t('home.cta')} →
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="secondary"
              size="lg"
              className="!bg-transparent !text-sand-50 !border-sand-50/40 hover:!bg-sand-50/10 hover:!text-sand-50 hover:scale-105 transition-transform duration-200 origin-center"
            >
              {t('home.ctaSecondary')}
            </Button>
          </motion.div>

          {/* Statistiques flottantes en bas du hero */}
          <motion.dl
            variants={fadeUp}
            className="mt-6 grid w-full max-w-2xl grid-cols-3 overflow-hidden bg-neutral-900/60 backdrop-blur-sm border border-sand-300/20 divide-x divide-sand-300/20"
          >
            {[
              { key: 'home.statsRoots', v: '10K+' },
              { key: 'home.statsPatterns', v: '47' },
              { key: 'home.statsDerived', v: '∞' },
            ].map((s) => (
              <div key={s.key} className="flex flex-col items-center py-6">
                <dt className="text-2xs font-semibold uppercase tracking-[0.22em] text-sand-100/60">
                  {t(s.key)}
                </dt>
                <dd className="mt-2 font-arabic text-3xl font-bold text-sand-300">
                  {s.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.section>
      </div>

      {/* ═════════ RESTE DE LA PAGE — dans le PageWrapper standard ═════════ */}
      <PageWrapper className="relative isolate">
      {/* Rails décoratifs : alphabet arabe défilant dans les marges (desktop only) */}
      <AlphabetRail side="left" />
      <AlphabetRail side="right" />

      {/* ═════════ FONCTIONNALITÉS ═════════ */}
      <section className="relative z-10 mt-2">
        <div className="flex flex-col items-center text-center">
          <Ornament />
          <p className="mt-5 text-2xs font-bold uppercase tracking-[0.3em] text-sand-600 dark:text-sand-300">
            {t('home.section02')}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('home.featuresTitle')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {t('home.featuresIntro')}
          </p>
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
    </>
  );
};

export default Home;
