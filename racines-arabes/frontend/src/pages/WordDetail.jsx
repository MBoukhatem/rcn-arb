// Page détail d'un mot — /words/:id. Présentation éditoriale du mot, sa morphologie,
// le lien vers la racine, et les actions favoris / édition / suppression.
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import BackLink from '@/components/ui/BackLink';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import WordForm, { EMPTY_WORD } from '@/components/word/WordForm';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getWord, updateWord, deleteWord } from '@/services/word.service';
import { getTypeLabel } from '@/utils/morphology';
import { joinLetters } from '@/utils/formatters';

const WordDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isEnglish = i18n.language?.startsWith('en');

  const { data: word, loading, error, refetch } = useFetch(
    () => getWord(id),
    [id],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState(EMPTY_WORD);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Politique d'édition/suppression : réservée aux administrateurs uniquement.
  const isAdmin = user?.role === 'admin';

  const openEdit = () => {
    setEditValues({
      arabic: word?.arabic ?? '',
      transliteration: word?.transliteration ?? '',
      translationFr: word?.translationFr ?? '',
      translationEn: word?.translationEn ?? '',
      type: word?.type ?? 'VERB',
      tense: word?.tense ?? 'MADI',
      pattern: word?.pattern ?? '',
      example: word?.example ?? '',
      notes: word?.notes ?? '',
    });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editValues.arabic.trim() || !editValues.pattern.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    if (editValues.type === 'VERB' && !editValues.tense) {
      toast.error(t('word.tenseRequired'));
      return;
    }
    const payload = { ...editValues };
    if (payload.type !== 'VERB') delete payload.tense;

    setEditSaving(true);
    try {
      await updateWord(id, payload);
      toast.success(t('word.updateSuccess'));
      setEditOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteWord(id);
      toast.success(t('word.deleteSuccess'));
      const rootSlug =
        typeof word?.root === 'object' ? word.root?.slug : null;
      navigate(rootSlug ? `/roots/${rootSlug}` : '/explorer', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !word) {
    return (
      <PageWrapper>
        <div className="mb-6">
          <BackLink to="/search" label={t('nav.search')} />
        </div>
        <EmptyState
          tone="error"
          eyebrow={t('common.error')}
          title={error?.message ?? t('errors.notFound')}
        />
      </PageWrapper>
    );
  }

  const root = typeof word.root === 'object' ? word.root : null;
  const translation = isEnglish
    ? (word.translationEn ?? word.translationFr)
    : (word.translationFr ?? word.translationEn);
  const altTranslation = isEnglish ? word.translationFr : word.translationEn;

  return (
    <PageWrapper>
      <div className="mb-6">
        {root?.slug ? (
          <BackLink
            to={`/roots/${root.slug}`}
            label={`Racine [ ${root.slug} ]`}
          />
        ) : (
          <BackLink to="/search" label={t('nav.search')} />
        )}
      </div>

      {/* En-tête mot */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-hidden"
      >
        {/* Barre supérieure */}
        <div className="flex items-center justify-between px-6 py-3 bg-neutral-0 dark:bg-neutral-900 border-b border-accent-700 dark:border-accent-300">
          <span className="font-mono text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — MOT / {getTypeLabel(word.type, t)}
          </span>
          {isAuthenticated && (
            <FavoriteButton item={word._id} itemModel="Word" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Mot en grand sur fond turquoise nuit */}
          <div className="relative lg:col-span-5 bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-10 sm:p-14 flex flex-col items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            <span className="relative text-2xs font-semibold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
              {getTypeLabel(word.type, t)}
            </span>
            <p
              lang="ar"
              dir="rtl"
              className="relative mt-6 font-arabic text-[5rem] sm:text-[7rem] font-bold leading-[0.9] text-center"
            >
              {word.arabic}
            </p>
            {word.transliteration && (
              <p className="relative mt-4 text-sm italic opacity-70">
                / {word.transliteration} /
              </p>
            )}
          </div>

          {/* Définitions à droite */}
          <div className="lg:col-span-7 p-8 sm:p-12 bg-neutral-0 dark:bg-neutral-900">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — {isEnglish ? 'Sens · EN' : 'Sens · FR'}
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {translation || '—'}
            </p>

            {altTranslation && (
              <div className="mt-6 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {isEnglish ? 'Sens · FR' : 'Sens · EN'}
                </p>
                <p className="mt-2 text-lg text-neutral-700 dark:text-neutral-300">
                  {altTranslation}
                </p>
              </div>
            )}

            {word.pattern && (
              <div className="mt-6 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('word.pattern')}
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-2 font-arabic text-2xl text-accent-600 dark:text-accent-300"
                >
                  {word.pattern}
                </p>
              </div>
            )}

            {word.type === 'VERB' && word.tense && (
              <div className="mt-4 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('word.tense')}
                </p>
                <p className="mt-2 text-base text-neutral-700 dark:text-neutral-300">
                  {t(`morphology.tense.${word.tense}`)}
                </p>
              </div>
            )}

            {word.example && (
              <div className="mt-4 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('word.example')}
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-2 font-arabic text-xl text-neutral-700 dark:text-neutral-300"
                >
                  {word.example}
                </p>
              </div>
            )}

            {word.notes && (
              <div className="mt-4 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('word.notes')}
                </p>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {word.notes}
                </p>
              </div>
            )}

            {isAdmin && (
              <div className="mt-8 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={openEdit}>
                  {t('word.editWord')}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  {t('word.deleteWord')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Racine d'origine */}
      {root && (
        <section className="mt-12">
          <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700/40 dark:border-sand-300/30 p-8 sm:p-10">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Racine d&apos;origine
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-baseline gap-6">
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-5xl font-bold text-ink dark:text-neutral-0"
                >
                  {joinLetters(root.letters ?? (root.slug ? root.slug.split('-') : []))}
                </p>
                {root.meaningFr && (
                  <p className="text-base text-neutral-700 dark:text-neutral-300">
                    « {root.meaningFr} »
                  </p>
                )}
              </div>
              <Button as={Link} to={`/roots/${root.slug}`} variant="primary" size="sm">
                {t('explorer.viewRoot')} →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Modale d'édition */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={t('word.editWord')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitEdit}
              loading={editSaving}
              disabled={editSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <WordForm values={editValues} onChange={setEditValues} />
      </Modal>

      {/* Modale de confirmation suppression */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('word.deleteWord')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleting}
              disabled={deleting}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {t('word.deleteConfirm')}
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-3xl font-bold text-ink dark:text-neutral-0"
          >
            {word.arabic}
          </p>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default WordDetail;
