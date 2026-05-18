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

// Classes partagées pour les selects natifs (alignées sur l'Input du design system).
const SELECT_CLASS =
  'w-full h-11 px-3.5 rounded-md text-sm bg-neutral-0 text-neutral-900 ' +
  'border border-neutral-300 transition-colors duration-150 ' +
  'focus:outline-none focus:border-accent-600 focus:ring-4 focus:ring-accent-600/[0.14] ' +
  'dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700 ' +
  'dark:focus:border-accent-400 dark:focus:ring-accent-400/20';
const LABEL_CLASS =
  'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5';

// Champs vides pour un nouveau mot.
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

// --- Formulaire de mot (création / édition) ---
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
  // Mots groupés par type côté backend.
  const {
    data: groupedWords,
    loading: wordsLoading,
    refetch: refetchWords,
  } = useFetch(() => getRootWords(slug, { group: true }), [slug]);

  // --- États des modales ---
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

  // Vérifie si l'utilisateur peut éditer/supprimer une ressource.
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

  // --- Mots : ouverture des modales ---
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
    // Le tense n'est transmis que pour les verbes.
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

  // --- Racine : édition / suppression ---
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

  // Actions par mot rendues dans WordList.
  const renderWordActions = (word) => (
    <div className="flex items-center gap-1">
      <FavoriteButton item={word?._id} itemModel="Word" />
      {canManage(word) && (
        <>
          <Button variant="ghost" size="sm" onClick={() => openEditWord(word)}>
            {t('common.edit')}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setWordToDelete(word)}>
            {t('common.delete')}
          </Button>
        </>
      )}
    </div>
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
        <p className="py-16 text-center text-base text-error-light dark:text-error-dark">
          {error?.message ?? t('errors.notFound')}
        </p>
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
        className="relative rounded-2xl border border-neutral-200 bg-neutral-0 p-8 text-center sm:p-12 dark:border-neutral-700 dark:bg-neutral-850"
      >
        <div className="absolute right-4 top-4">
          <FavoriteButton item={root._id} itemModel="Root" />
        </div>
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic text-ar-lg font-bold text-neutral-900 sm:text-ar-hero dark:text-neutral-50"
        >
          {joinLetters(root.letters ?? [])}
        </p>
        {root.transliteration && (
          <p className="mt-3 text-base italic text-neutral-400 dark:text-neutral-500">
            {root.transliteration}
          </p>
        )}
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-700 dark:text-neutral-300">
          {root.meaningFr}
        </p>
        {root.meaningAr && (
          <p
            lang="ar"
            dir="rtl"
            className="mx-auto mt-2 font-arabic text-ar-sm text-neutral-500 dark:text-neutral-400"
          >
            {root.meaningAr}
          </p>
        )}

        {isAuthenticated && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="sm" onClick={openCreateWord}>
              {t('root.addWord')}
            </Button>
            {canManage(root) && (
              <>
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
              </>
            )}
          </div>
        )}
      </motion.section>

      {/* Mots dérivés */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t('root.derivedWords')}
        </h2>
        {wordsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="mt-6">
            <WordList
              words={groupedWords}
              grouped
              renderActions={renderWordActions}
            />
          </div>
        )}
      </section>

      {/* Modale mot (create / edit) */}
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

      {/* Modale édition racine */}
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

      {/* Confirmation suppression racine */}
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
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('root.deleteConfirm')}
        </p>
      </Modal>

      {/* Confirmation suppression mot */}
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
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('word.deleteConfirm')}
          </p>
          {wordToDelete && (
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-ar-base text-neutral-900 dark:text-neutral-50"
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
