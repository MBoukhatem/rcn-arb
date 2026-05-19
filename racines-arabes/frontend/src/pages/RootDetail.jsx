// Page détail d'une racine — /roots/:slug. Racine, mots dérivés, actions CRUD protégées.
import { useState, useCallback } from 'react';
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
import WordList from '@/components/root/WordList';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getRoot, getRootWords, updateRoot, deleteRoot } from '@/services/root.service';
import { createWord, updateWord, deleteWord } from '@/services/word.service';
import { WORD_TYPES, VERB_TENSES, getTypeLabel } from '@/utils/morphology';
import { joinLetters } from '@/utils/formatters';

const SELECT_CLASS =
  'w-full h-11 px-3.5 text-sm bg-neutral-0 text-ink ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/30 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 ' +
  'dark:focus:ring-accent-300/30';
const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2';

const EMPTY_WORD = {
  arabic: '',
  transliteration: '',
  translationFr: '',
  translationEn: '',
  type: 'VERB',
  tense: 'MADI',
  pattern: '',
  example: '',
  notes: '',
};

const WordForm = ({ values, onChange }) => {
  const { t } = useTranslation();
  const handle = (e) => onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <Input
        label={t('word.arabic')}
        name="arabic"
        value={values.arabic}
        onChange={handle}
        placeholder={t('word.arabicPlaceholder')}
        required
      />
      <Input
        label={t('word.transliteration')}
        name="transliteration"
        value={values.transliteration}
        onChange={handle}
        required
      />
      <Input
        label={t('word.translationFr')}
        name="translationFr"
        value={values.translationFr}
        onChange={handle}
        required
      />
      <Input
        label={t('word.translationEn')}
        name="translationEn"
        value={values.translationEn}
        onChange={handle}
      />
      <div>
        <label className={LABEL_CLASS} htmlFor="word-type">
          {t('word.type')}
        </label>
        <select
          id="word-type"
          name="type"
          value={values.type}
          onChange={handle}
          className={SELECT_CLASS}
        >
          {WORD_TYPES.map((code) => (
            <option key={code} value={code}>
              {getTypeLabel(code, t)}
            </option>
          ))}
        </select>
      </div>
      {values.type === 'VERB' && (
        <div>
          <label className={LABEL_CLASS} htmlFor="word-tense">
            {t('word.tense')}
          </label>
          <select
            id="word-tense"
            name="tense"
            value={values.tense}
            onChange={handle}
            className={SELECT_CLASS}
          >
            {VERB_TENSES.map((code) => (
              <option key={code} value={code}>
                {t(`morphology.tense.${code}`)}
              </option>
            ))}
          </select>
        </div>
      )}
      <Input
        label={t('word.pattern')}
        name="pattern"
        value={values.pattern}
        onChange={handle}
        required
      />
      <Input
        label={t('word.example')}
        name="example"
        value={values.example}
        onChange={handle}
      />
      <Input
        label={t('word.notes')}
        name="notes"
        value={values.notes}
        onChange={handle}
      />
    </div>
  );
};

const RootDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
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

  const canManage = useCallback(
    (resource) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      const owner = resource?.createdBy?._id ?? resource?.createdBy;
      return owner === user._id;
    },
    [user],
  );

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
      <FavoriteButton item={word?._id} itemModel="Word" />
      {canManage(word) && (
        <>
          <button
            type="button"
            onClick={() => openEditWord(word)}
            aria-label={t('common.edit')}
            title={t('common.edit')}
            className="inline-flex h-9 w-9 items-center justify-center border border-neutral-950 dark:border-neutral-0 text-ink dark:text-neutral-0 hover:bg-neutral-950 hover:text-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 17h4l9-9-4-4-9 9v4zM12 5l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setWordToDelete(word)}
            aria-label={t('common.delete')}
            title={t('common.delete')}
            className="inline-flex h-9 w-9 items-center justify-center border border-accent-500 dark:border-accent-300 text-accent-500 dark:text-accent-300 hover:bg-accent-500 hover:text-neutral-0 dark:hover:bg-accent-300 dark:hover:text-neutral-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11M9 9v6M11 9v6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
      {/* En-tête racine */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
      >
        {/* En-tête bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-neutral-0 dark:bg-neutral-950">
          <span className="font-mono text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — RACINE / {root.slug}
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
              — Sens · FR
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {root.meaningFr}
            </p>

            {root.meaningEn && (
              <div className="mt-6 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — Sens · EN
                </p>
                <p className="mt-2 text-lg text-neutral-700 dark:text-neutral-300">
                  {root.meaningEn}
                </p>
              </div>
            )}

            {root.meaningAr && (
              <div className="mt-4 pt-4">
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — Sens · AR
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

            {isAuthenticated && canManage(root) && (
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
              — 02 / Dérivés
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('root.derivedWords')}
            </h2>
          </div>
          {isAuthenticated && (
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
          <WordList
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
