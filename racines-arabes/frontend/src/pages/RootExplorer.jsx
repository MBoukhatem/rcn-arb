// Page explorateur — cœur métier. Sélection des 3 lettres et racine dérivée.
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import LetterPicker from '@/components/root/LetterPicker';
import RootCard from '@/components/root/RootCard';
import { useAuth } from '@/hooks/useAuth';
import { getRoot, createRoot } from '@/services/root.service';
import { slugFromLetters, joinLetters } from '@/utils/formatters';

const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2';

const RootExplorer = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [letters, setLetters] = useState(['', '', '']);
  const complete = letters.every((l) => l && l.length > 0);
  const slug = complete ? slugFromLetters(letters) : '';

  const [root, setRoot] = useState(null);
  const [rootLoading, setRootLoading] = useState(false);
  const [rootResolved, setRootResolved] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState({
    meaningFr: '',
    meaningEn: '',
    meaningAr: '',
  });
  const [creating, setCreating] = useState(false);

  const resolveRoot = useCallback(async (currentSlug) => {
    setRootLoading(true);
    setRootResolved(false);
    setRoot(null);
    try {
      const found = await getRoot(currentSlug);
      setRoot(found);
    } catch (err) {
      if (err?.status !== 404) {
        toast.error(err?.message ?? t('errors.generic'));
      }
      setRoot(null);
    } finally {
      setRootLoading(false);
      setRootResolved(true);
    }
  }, [t]);

  const handleLettersChange = (next) => {
    setLetters(next);
    const allSet = next.every((l) => l && l.length > 0);
    if (allSet) {
      resolveRoot(slugFromLetters(next));
    } else {
      setRoot(null);
      setRootResolved(false);
    }
  };

  const submitCreateRoot = async () => {
    if (!createValues.meaningFr.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    setCreating(true);
    try {
      await createRoot({ letters, ...createValues });
      toast.success(t('root.createSuccess'));
      setCreateOpen(false);
      setCreateValues({ meaningFr: '', meaningEn: '', meaningAr: '' });
      resolveRoot(slug);
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageWrapper title={t('explorer.title')} eyebrow="Explorateur · 01">
      <p className="-mt-8 mb-12 mx-auto max-w-2xl text-center text-base text-neutral-700 dark:text-neutral-300">
        {t('explorer.subtitle')}
      </p>

      {/* Sélecteur de lettres */}
      <section className="relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-6 sm:p-10">
        <LetterPicker value={letters} onChange={handleLettersChange} />
      </section>

      {/* Résultat de la racine */}
      <section className="mt-14">
        {!complete && (
          <EmptyState
            eyebrow="En attente"
            title={t('explorer.selectAllLetters')}
            className="!bg-neutral-0 dark:!bg-neutral-900 border border-accent-700 dark:border-accent-300"
          />
        )}

        {complete && rootLoading && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner size="lg" />
            <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              {t('common.loading')}
            </p>
          </div>
        )}

        {complete && !rootLoading && rootResolved && root && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Racine identifiée */}
            <div className="mx-auto max-w-md">
              <p className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-accent-600 dark:text-sand-300">
                — Racine identifiée
              </p>
              <RootCard root={root} interactive={false} />
              <Button
                as={Link}
                to={`/roots/${root.slug}`}
                variant="primary"
                size="md"
                className="mt-4 w-full"
              >
                {t('explorer.viewRoot')} →
              </Button>
            </div>
          </motion.div>
        )}

        {complete && !rootLoading && rootResolved && !root && (
          <div className="bg-neutral-50 dark:bg-neutral-900 p-10 text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Aucune racine trouvée
            </p>
            <p
              lang="ar"
              dir="rtl"
              className="mt-4 font-arabic text-5xl font-bold text-ink dark:text-neutral-0"
            >
              {joinLetters(letters)}
            </p>
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
              {t('explorer.noRoot')}
            </p>
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                className="mt-6"
                onClick={() => setCreateOpen(true)}
              >
                {t('root.createRoot')} +
              </Button>
            ) : (
              <p className="mt-4 text-2xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {t('explorer.loginToCreate')}
              </p>
            )}
          </div>
        )}
      </section>

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('root.createRoot')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitCreateRoot}
              loading={creating}
              disabled={creating}
            >
              {t('common.create')}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <span className={LABEL_CLASS}>{t('root.letters')}</span>
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-3xl font-bold text-accent-500 dark:text-accent-300"
            >
              {joinLetters(letters)}
            </p>
          </div>
          <Input
            label={t('root.meaningFr')}
            name="meaningFr"
            value={createValues.meaningFr}
            onChange={(e) =>
              setCreateValues((p) => ({ ...p, meaningFr: e.target.value }))
            }
            required
          />
          <Input
            label={t('root.meaningEn')}
            name="meaningEn"
            value={createValues.meaningEn}
            onChange={(e) =>
              setCreateValues((p) => ({ ...p, meaningEn: e.target.value }))
            }
          />
          <Input
            label={t('root.meaningAr')}
            name="meaningAr"
            value={createValues.meaningAr}
            onChange={(e) =>
              setCreateValues((p) => ({ ...p, meaningAr: e.target.value }))
            }
          />
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default RootExplorer;
