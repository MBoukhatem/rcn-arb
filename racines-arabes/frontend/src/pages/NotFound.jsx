// Page 404 — route catch-all, écran éditorial monumental.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className="relative min-h-[70vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Côté gauche : numéro */}
        <div className="relative bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 flex flex-col items-center justify-center py-14 px-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <p className="relative text-2xs font-bold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
            — {t('notFound.statusEyebrow')}
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative font-mono text-[12rem] sm:text-[16rem] font-extrabold leading-none mt-2"
          >
            404
          </motion.p>
          <p
            lang="ar"
            dir="rtl"
            className="relative mt-4 font-arabic text-4xl font-bold"
          >
            ٤٠٤
          </p>
        </div>

        {/* Côté droit : message */}
        <div className="flex flex-col justify-center p-10 sm:p-14 bg-neutral-0 dark:bg-neutral-950">
          <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
            — {t('notFound.pageNotFoundEyebrow')}
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('notFound.title')}
          </h1>
          <p className="mt-5 max-w-md text-base text-neutral-700 dark:text-neutral-300">
            {t('notFound.message')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/" variant="primary" size="lg">
              {t('notFound.backHome')} →
            </Button>
            <Button as={Link} to="/explorer" variant="secondary" size="lg">
              {t('nav.explorer')}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
