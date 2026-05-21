// Page détail d'une racine — /roots/:slug. Racine, mots dérivés, actions CRUD protégées.
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import BackLink from '@/components/ui/BackLink';
import WordTable from '@/components/root/WordTable';
import WordForm, { EMPTY_WORD } from '@/components/word/WordForm';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { ViewButton, EditButton, DeleteButton } from '@/components/ui/ActionButtons';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getRoot, getRootWords, updateRoot, deleteRoot } from '@/services/root.service';
import { createWord, updateWord, deleteWord } from '@/services/word.service';
import { getTypeLabel } from '@/utils/morphology';
import { joinLetters } from '@/utils/formatters';

const RootDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: root, loading, error, refetch } = useFetch(
    () => getRoot(slug),
    [slug],
  );
  const {
    data: groupedWords,
    loading: wordsLoading,
    refetch: refetchWords,
  } = useFetch(() => getRootWords(slug, { group: true }), [slug]);

  const [wordModal, setWordModal] = useState({ open: false, mode: 'create', word: null });
  const [wordValues, setWordValues] = useState(EMPTY_WORD);
  const [wordSaving, setWordSaving] = useState(false);

  const [rootModalOpen, setRootModalOpen] = useState(false);
  const [rootValues, setRootValues] = useState({ meaningFr: '', meaningEn: '', meaningAr: '' });
  const [rootSaving, setRootSaving] = useState(false);

  const [deleteRootOpen, setDeleteRootOpen] = useState(false);
  const [rootDeleting, setRootDeleting] = useState(false);

  const [wordToDelete, setWordToDelete] = useState(null);
  const [wordDeleting, setWordDeleting] = useState(false);

  // Politique d'édition/suppression : réservée aux administrateurs uniquement.
  const isAdmin = user?.role === 'admin';

  const refreshAll = () => {
    refetch();
    refetchWords();
  };

  const openCreateWord = () => {
    setWordValues(EMPTY_WORD);
    setWordModal({ open: true, mode: 'create', word: null });
  };
  const openEditWord = (word) => {
    setWordValues({
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
    setWordModal({ open: true, mode: 'edit', word });
  };

  const submitWord = async () => {
    if (!wordValues.arabic.trim() || !wordValues.pattern.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    if (wordValues.type === 'VERB' && !wordValues.tense) {
      toast.error(t('word.tenseRequired'));
      return;
    }
    const payload = { ...wordValues };
    if (payload.type !== 'VERB') delete payload.tense;

    setWordSaving(true);
    try {
      if (wordModal.mode === 'create') {
        await createWord({ ...payload, root: root?._id });
        toast.success(t('word.createSuccess'));
      } else {
        await updateWord(wordModal.word._id, payload);
        toast.success(t('word.updateSuccess'));
      }
      setWordModal({ open: false, mode: 'create', word: null });
      refreshAll();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setWordSaving(false);
    }
  };

  const confirmDeleteWord = async () => {
    setWordDeleting(true);
    try {
      await deleteWord(wordToDelete._id);
      toast.success(t('word.deleteSuccess'));
      setWordToDelete(null);
      refreshAll();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setWordDeleting(false);
    }
  };

  const openEditRoot = () => {
    setRootValues({
      meaningFr: root?.meaningFr ?? '',
      meaningEn: root?.meaningEn ?? '',
      meaningAr: root?.meaningAr ?? '',
    });
    setRootModalOpen(true);
  };

  const submitRoot = async () => {
    if (!rootValues.meaningFr.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    setRootSaving(true);
    try {
      await updateRoot(slug, rootValues);
      toast.success(t('root.updateSuccess'));
      setRootModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setRootSaving(false);
    }
  };

  const confirmDeleteRoot = async () => {
    setRootDeleting(true);
    try {
      await deleteRoot(slug);
      toast.success(t('root.deleteSuccess'));
      navigate('/explorer', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setRootDeleting(false);
      setDeleteRootOpen(false);
    }
  };

  const renderWordActions = (word) => (
    <>
      {word?._id && (
        <ViewButton to={`/words/${word._id}`} label={t('explorer.viewRoot')} />
      )}
      <FavoriteButton item={word?._id} itemModel="Word" />
      {isAdmin && (
        <>
          <EditButton onClick={() => openEditWord(word)} label={t('common.edit')} />
          <DeleteButton onClick={() => setWordToDelete(word)} label={t('common.delete')} />
        </>
      )}
    </>
  );

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !root) {
    return (
      <PageWrapper>
        <div className="mb-6">
          <BackLink to="/explorer" label={t('nav.explorer')} />
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 py-20 text-center">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            {error?.message ?? t('errors.notFound')}
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <BackLink to="/explorer" label={t('nav.explorer')} />
      </div>

      {/* En-tête racine */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-hidden"
      >
        {/* En-tête bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-neutral-0 dark:bg-neutral-900 border-b border-accent-700 dark:border-accent-300">
          <span className="font-mono text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — {t('root.rootPrefix')} / {root.slug}
          </span>
          <FavoriteButton item={root._id} itemModel="Root" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Lettres en grand sur fond noir */}
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
              [ {root.letters?.join(' · ') ?? '—'} ]
            </span>
            <p
              lang="ar"
              dir="rtl"
              className="relative mt-6 font-arabic text-[5rem] sm:text-[7rem] font-bold leading-[0.9]"
            >
              {joinLetters(root.letters ?? [])}
            </p>
            {root.transliteration && (
              <p className="relative mt-4 text-sm italic opacity-70">
                / {root.transliteration} /
              </p>
            )}
          </div>

          {/* Définitions à droite */}
          <div className="lg:col-span-7 p-8 sm:p-12 bg-neutral-0 dark:bg-neutral-950">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — {t('root.meaningFrShort')}
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {root.meaningFr}
            </p>

            {root.meaningEn && (
              <div className="mt-6 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('root.meaningEnShort')}
                </p>
                <p className="mt-2 text-lg text-neutral-700 dark:text-neutral-300">
                  {root.meaningEn}
                </p>
              </div>
            )}

            {root.meaningAr && (
              <div className="mt-4 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('root.meaningArShort')}
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-2 font-arabic text-2xl text-neutral-700 dark:text-neutral-300"
                >
                  {root.meaningAr}
                </p>
              </div>
            )}

            {isAdmin && (
              <div className="mt-8 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={openEditRoot}>
                  {t('root.editRoot')}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteRootOpen(true)}
                >
                  {t('root.deleteRoot')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Mots dérivés */}
      <section className="mt-16">
        <header className="flex flex-wrap items-end justify-between gap-4 pb-4 mb-10">
          <div>
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — {t('root.section02')}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('root.derivedWords')}
            </h2>
          </div>
          {isAdmin && (
            <Button variant="primary" size="sm" onClick={openCreateWord}>
              + {t('root.addWord')}
            </Button>
          )}
        </header>
        {wordsLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : (
          <WordTable
            words={groupedWords}
            grouped
            renderActions={renderWordActions}
          />
        )}
      </section>

      {/* Modales */}
      <Modal
        isOpen={wordModal.open}
        onClose={() => setWordModal({ open: false, mode: 'create', word: null })}
        title={wordModal.mode === 'create' ? t('word.addWord') : t('word.editWord')}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setWordModal({ open: false, mode: 'create', word: null })}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitWord}
              loading={wordSaving}
              disabled={wordSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <WordForm values={wordValues} onChange={setWordValues} />
      </Modal>

      <Modal
        isOpen={rootModalOpen}
        onClose={() => setRootModalOpen(false)}
        title={t('root.editRoot')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRootModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitRoot}
              loading={rootSaving}
              disabled={rootSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={t('root.meaningFr')}
            name="meaningFr"
            value={rootValues.meaningFr}
            onChange={(e) =>
              setRootValues((p) => ({ ...p, meaningFr: e.target.value }))
            }
            required
          />
          <Input
            label={t('root.meaningEn')}
            name="meaningEn"
            value={rootValues.meaningEn}
            onChange={(e) =>
              setRootValues((p) => ({ ...p, meaningEn: e.target.value }))
            }
          />
          <Input
            label={t('root.meaningAr')}
            name="meaningAr"
            value={rootValues.meaningAr}
            onChange={(e) =>
              setRootValues((p) => ({ ...p, meaningAr: e.target.value }))
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteRootOpen}
        onClose={() => setDeleteRootOpen(false)}
        title={t('root.deleteRoot')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteRootOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteRoot}
              loading={rootDeleting}
              disabled={rootDeleting}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {t('root.deleteConfirm')}
        </p>
      </Modal>

      <Modal
        isOpen={!!wordToDelete}
        onClose={() => setWordToDelete(null)}
        title={t('word.deleteWord')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setWordToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteWord}
              loading={wordDeleting}
              disabled={wordDeleting}
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
          {wordToDelete && (
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-3xl font-bold text-ink dark:text-neutral-0"
            >
              {wordToDelete.arabic}
              {wordToDelete.type && (
                <Badge className="ms-3 align-middle">
                  {getTypeLabel(wordToDelete.type, t)}
                </Badge>
              )}
            </p>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default RootDetail;
