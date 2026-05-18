// Page 404 — route catch-all.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import PageWrapper from '@/components/layout/PageWrapper';
import Button from '@/components/ui/Button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-arabic text-ar-hero font-bold text-accent-600 dark:text-accent-400"
        >
          ٤٠٤
        </motion.p>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 max-w-md text-base text-neutral-600 dark:text-neutral-400">
          {t('notFound.message')}
        </p>
        <Button as={Link} to="/" variant="primary" size="lg" className="mt-8">
          {t('notFound.backHome')}
        </Button>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
