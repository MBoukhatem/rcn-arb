// Page explorateur — cœur métier. Sélection des 3 lettres, racine + recherche avancée.
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import LetterPicker from '@/components/root/LetterPicker';
import RootCard from '@/components/root/RootCard';
import WordList from '@/components/root/WordList';
import WordCard from '@/components/word/WordCard';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getRoot, getRootWords, createRoot } from '@/services/root.service';
import { getWords } from '@/services/word.service';
import { WORD_TYPES, VERB_TENSES, getTypeLabel } from '@/utils/morphology';
import { slugFromLetters, joinLetters } from '@/utils/formatters';

const SELECT_CLASS =
  'h-11 px-3.5 rounded-md text-sm bg-neutral-0 text-neutral-900 ' +
  'border border-neutral-300 transition-colors duration-150 ' +
  'focus:outline-none focus:border-accent-600 focus:ring-4 focus:ring-accent-600/[0.14] ' +
  'dark:bg-neutral-850 dark:text-neutral-50 dark:border-neutral-700 ' +
  'dark:focus:border-accent-400 dark:focus:ring-accent-400/20';
const LABEL_CLASS =
  'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5';

const RootExplorer = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  // --- Sélection des lettres ---
  const [letters, setLetters] = useState(['', '', '']);
  const complete = letters.every((l) => l && l.length > 0);
  const slug = complete ? slugFromLetters(letters) : '';

  // --- État de la racine résolue ---
  const [root, setRoot] = useState(null);
  const [rootWords, setRootWords] = useState(null);
  const [rootLoading, setRootLoading] = useState(false);
  const [rootResolved, setRootResolved] = useState(false); // une recherche a-t-elle eu lieu

  // --- Modale création de racine ---
  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState({
    meaningFr: '',
    meaningEn: '',
    meaningAr: '',
  });
  const [creating, setCreating] = useState(false);

  // Résout la racine pour le slug courant.
  const resolveRoot = useCallback(async (currentSlug) => {
    setRootLoading(true);
    setRootResolved(false);
    setRoot(null);
    setRootWords(null);
    try {
      const found = await getRoot(currentSlug);
      setRoot(found);
      const words = await getRootWords(currentSlug, { group: true });
      setRootWords(words);
    } catch (err) {
      // 404 = racine inexistante : cas normal, pas une erreur affichée.
      if (err?.status !== 404) {
        toast.error(err?.message ?? t('errors.generic'));
      }
      setRoot(null);
    } finally {
      setRootLoading(false);
      setRootResolved(true);
    }
  }, [t]);

  // Changement de lettres : on (re)lance la résolution si les 3 sont posées.
  const handleLettersChange = (next) => {
    setLetters(next);
    const allSet = next.every((l) => l && l.length > 0);
    if (allSet) {
      resolveRoot(slugFromLetters(next));
    } else {
      setRoot(null);
      setRootWords(null);
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
    <PageWrapper title={t('explorer.title')}>
      <p className="-mt-4 mb-8 text-base text-neutral-600 dark:text-neutral-400">
        {t('explorer.subtitle')}
      </p>

      {/* Sélecteur de lettres */}
      <section className="rounded-2xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850">
        <LetterPicker value={letters} onChange={handleLettersChange} />
      </section>

      {/* Résultat de la racine */}
      <section className="mt-10">
        {!complete && (
          <p className="py-12 text-center text-base text-neutral-500 dark:text-neutral-400">
            {t('explorer.selectAllLetters')}
          </p>
        )}

        {complete && rootLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {complete && !rootLoading && rootResolved && root && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <RootCard root={root} />
                <Button
                  as={Link}
                  to={`/roots/${root.slug}`}
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                >
                  {t('explorer.viewRoot')}
                </Button>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {t('root.derivedWords')}
                </h2>
                <div className="mt-4">
                  <WordList words={rootWords} grouped />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {complete && !rootLoading && rootResolved && !root && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-600 dark:bg-neutral-850">
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-ar-base font-semibold text-neutral-900 dark:text-neutral-50"
            >
              {joinLetters(letters)}
            </p>
            <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
              {t('explorer.noRoot')}
            </p>
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                className="mt-5"
                onClick={() => setCreateOpen(true)}
              >
                {t('root.createRoot')}
              </Button>
            ) : (
              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                {t('explorer.loginToCreate')}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Panneau de recherche avancée des mots */}
      <AdvancedWordSearch rootSlug={root?.slug} />

      {/* Modale création de racine */}
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
        <div className="space-y-4">
          <div>
            <span className={LABEL_CLASS}>{t('root.letters')}</span>
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-ar-base font-semibold text-accent-600 dark:text-accent-400"
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

// --- Panneau de recherche avancée multi-filtres des mots ---
const AdvancedWordSearch = ({ rootSlug }) => {
  const { t } = useTranslation();

  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [tense, setTense] = useState('');
  const [sortBy, setSortBy] = useState('alpha');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQ = useDebounce(q, 400);

  // Construit les params et lance la recherche à chaque changement de filtre.
  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sortBy, page, limit: 9 };
      if (debouncedQ.trim()) params.q = debouncedQ.trim();
      if (type) params.type = type;
      if (type === 'VERB' && tense) params.tense = tense;
      if (rootSlug) params.root = rootSlug;
      const res = await getWords(params);
      setResults(res);
    } catch (err) {
      setError(err);
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, type, tense, sortBy, page, rootSlug, t]);

  // Relance la recherche au montage et à chaque changement de filtre
  // (runSearch est mémoïsé sur l'ensemble des filtres).
  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handleResetFilters = () => {
    setQ('');
    setType('');
    setTense('');
    setSortBy('alpha');
    setPage(1);
  };

  // Réinitialise la page sur changement de filtre.
  const onFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const words = results?.data ?? [];
  const totalPages = results?.totalPages ?? 1;

  return (
    <section className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        {t('explorer.advancedSearch')}
      </h2>

      {/* Filtres */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Input
            label={t('common.search')}
            name="q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder={t('explorer.searchPlaceholder')}
          />
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="filter-type">
            {t('explorer.type')}
          </label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => onFilterChange(setType)(e.target.value)}
            className={`${SELECT_CLASS} w-full`}
          >
            <option value="">{t('explorer.allTypes')}</option>
            {WORD_TYPES.map((code) => (
              <option key={code} value={code}>
                {getTypeLabel(code, t)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="filter-tense">
            {t('explorer.tense')}
          </label>
          <select
            id="filter-tense"
            value={tense}
            onChange={(e) => onFilterChange(setTense)(e.target.value)}
            disabled={type !== 'VERB'}
            className={`${SELECT_CLASS} w-full disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <option value="">{t('explorer.allTenses')}</option>
            {VERB_TENSES.map((code) => (
              <option key={code} value={code}>
                {t(`morphology.tense.${code}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS} htmlFor="filter-sort">
            {t('explorer.sortBy')}
          </label>
          <select
            id="filter-sort"
            value={sortBy}
            onChange={(e) => onFilterChange(setSortBy)(e.target.value)}
            className={`${SELECT_CLASS} w-full`}
          >
            <option value="alpha">{t('explorer.sortAlpha')}</option>
            <option value="type">{t('explorer.sortType')}</option>
            <option value="date">{t('explorer.sortDate')}</option>
          </select>
        </div>
      </div>

      <div className="mt-3">
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          {t('explorer.resetFilters')}
        </Button>
      </div>

      {/* Résultats */}
      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner size="md" />
          </div>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-base text-error-light dark:text-error-dark">
            {error?.message ?? t('errors.generic')}
          </p>
        )}

        {!loading && !error && words.length === 0 && (
          <p className="py-10 text-center text-base text-neutral-500 dark:text-neutral-400">
            {t('common.noResults')}
          </p>
        )}

        {!loading && !error && words.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {words.map((word) => (
                <WordCard key={word._id} word={word} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RootExplorer;
