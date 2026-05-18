// Page d'accueil — landing éditoriale en noir et blanc, accents pourpre rougeâtre.
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

const KTB_DERIVED = [
  { ar: 'كَاتِب', tr: 'kātib', meaning: 'écrivain' },
  { ar: 'مَكْتَب', tr: 'maktab', meaning: 'bureau' },
  { ar: 'كِتَاب', tr: 'kitāb', meaning: 'livre' },
  { ar: 'كِتَابَة', tr: 'kitāba', meaning: 'écriture' },
  { ar: 'مَكْتُوب', tr: 'maktūb', meaning: 'écrit' },
  { ar: 'مَكْتَبَة', tr: 'maktaba', meaning: 'bibliothèque' },
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
      {/* ───────── HERO ───────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative border-2 border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-950 overflow-hidden"
      >
        {/* Eyebrow bar */}
        <div className="flex items-center justify-between border-b border-neutral-950 dark:border-neutral-0 px-6 sm:px-10 py-3">
          <span className="text-2xs font-bold uppercase tracking-[0.32em] text-neutral-950 dark:text-neutral-0">
            — DICTIONNAIRE / N°001
          </span>
          <span className="hidden sm:inline-flex text-2xs font-semibold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            ك · ت · ب
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Texte gauche */}
          <div className="lg:col-span-7 px-6 sm:px-10 py-12 lg:py-20 lg:border-r-2 lg:border-neutral-950 dark:lg:border-neutral-0">
            <motion.p
              variants={fadeUp}
              className="text-2xs font-bold uppercase tracking-[0.4em] text-accent-500 dark:text-accent-300"
            >
              — La face cachée de la langue
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-neutral-950 dark:text-neutral-0"
            >
              {t('home.heroTitle')}
            </motion.h1>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
              <span className="h-px w-16 bg-neutral-950 dark:bg-neutral-0" aria-hidden="true" />
              <p className="text-base sm:text-lg max-w-xl text-neutral-700 dark:text-neutral-300">
                {t('home.heroSubtitle')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <Button as={Link} to="/explorer" variant="primary" size="lg">
                {t('home.cta')} →
              </Button>
              <Button as={Link} to="/about" variant="secondary" size="lg">
                {t('home.ctaSecondary')}
              </Button>
            </motion.div>

            {/* Statistique typographique */}
            <motion.dl
              variants={fadeUp}
              className="mt-14 grid grid-cols-3 gap-6 border-t border-neutral-300 dark:border-neutral-700 pt-8"
            >
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Racines
                </dt>
                <dd className="mt-2 font-mono text-3xl font-bold text-neutral-950 dark:text-neutral-0">
                  10K+
                </dd>
              </div>
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Schèmes
                </dt>
                <dd className="mt-2 font-mono text-3xl font-bold text-neutral-950 dark:text-neutral-0">
                  47
                </dd>
              </div>
              <div>
                <dt className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Dérivés
                </dt>
                <dd className="mt-2 font-mono text-3xl font-bold text-accent-500 dark:text-accent-300">
                  ∞
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* Bloc arabe géant droite */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 relative flex flex-col items-center justify-center px-6 sm:px-10 py-16 lg:py-20 bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950"
          >
            {/* Grille pointillée décorative */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <p className="relative text-2xs font-semibold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
              [ ROOT.001 ]
            </p>
            <p
              lang="ar"
              dir="rtl"
              className="relative font-arabic font-bold text-[8rem] sm:text-[10rem] leading-[0.9] mt-4"
            >
              ك ت ب
            </p>
            <div className="relative mt-6 flex items-center gap-2 text-2xs uppercase tracking-[0.3em]">
              <span>K</span>
              <span className="opacity-40">·</span>
              <span>T</span>
              <span className="opacity-40">·</span>
              <span>B</span>
            </div>
            <p className="relative mt-6 text-sm italic opacity-70">
              « écrire / inscrire »
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ───────── FONCTIONNALITÉS ───────── */}
      <section className="mt-24">
        <div className="flex items-end justify-between gap-6 border-b-2 border-neutral-950 dark:border-neutral-0 pb-6">
          <div>
            <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
              — 02 / Système
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
              {t('home.featuresTitle')}
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            03 modules
          </span>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-0 border-l-2 border-t-2 border-neutral-950 dark:border-neutral-0"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              className="relative border-r-2 border-b-2 border-neutral-950 dark:border-neutral-0 p-8 bg-neutral-0 dark:bg-neutral-950 group hover:bg-neutral-950 hover:text-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950 transition-colors"
            >
              <span className="font-mono text-xs font-semibold tracking-[0.18em] text-accent-500 dark:text-accent-300 group-hover:text-accent-300 dark:group-hover:text-accent-500">
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed opacity-80">
                {f.text}
              </p>
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 text-2xs font-bold tracking-[0.2em]"
              >
                →
              </span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ───────── EXEMPLE VISUEL : KTB derived ───────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-24 border-2 border-neutral-950 dark:border-neutral-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-8 sm:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-neutral-950 dark:border-neutral-0 bg-neutral-50 dark:bg-neutral-900">
            <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
              — 03 / Démonstration
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
              {t('home.exampleTitle')}
            </h2>
            <p className="mt-5 text-base text-neutral-700 dark:text-neutral-300">
              {t('home.exampleText')}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic text-6xl font-extrabold text-neutral-950 dark:text-neutral-0"
              >
                ك ت ب
              </p>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                <p>K·T·B</p>
                <p className="mt-1 text-accent-500 dark:text-accent-300">06 dérivés</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-0">
            {KTB_DERIVED.map((w, i) => (
              <div
                key={w.tr}
                className={`relative flex flex-col p-6 border-neutral-950 dark:border-neutral-0 ${
                  i % 3 !== 2 ? 'border-r-2' : ''
                } ${i < KTB_DERIVED.length - 3 ? 'border-b-2' : ''}`}
              >
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-3xl font-bold text-neutral-950 dark:text-neutral-0 mt-3"
                >
                  {w.ar}
                </span>
                <span className="mt-1 text-xs italic text-neutral-500 dark:text-neutral-400">
                  {w.tr}
                </span>
                <span className="mt-3 text-2xs uppercase tracking-[0.16em] font-semibold text-neutral-700 dark:text-neutral-300">
                  {w.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ───────── CTA FINAL ───────── */}
      <section className="mt-24 border-2 border-neutral-950 dark:border-neutral-0 bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-10 sm:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="text-2xs font-bold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
              — Prêt à explorer ?
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Commencez par <span className="text-outline">trois lettres</span>.
            </h2>
            <p className="mt-5 max-w-xl opacity-80">
              Sélectionnez votre racine, parcourez ses dérivés, comprenez la
              mécanique morphologique de la langue arabe.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Button as={Link} to="/explorer" variant="secondary" size="lg">
              Ouvrir l&apos;explorateur →
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
