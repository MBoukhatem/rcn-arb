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
  'h-11 px-3.5 text-sm bg-neutral-0 text-neutral-950 ' +
  'border border-neutral-950 transition-colors duration-150 ' +
  'focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 dark:border-neutral-0 ' +
  'dark:focus:border-accent-300 dark:focus:ring-accent-300/30';
const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-950 dark:text-neutral-0 mb-2';

const RootExplorer = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [letters, setLetters] = useState(['', '', '']);
  const complete = letters.every((l) => l && l.length > 0);
  const slug = complete ? slugFromLetters(letters) : '';

  const [root, setRoot] = useState(null);
  const [rootWords, setRootWords] = useState(null);
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
    setRootWords(null);
    try {
      const found = await getRoot(currentSlug);
      setRoot(found);
      const words = await getRootWords(currentSlug, { group: true });
      setRootWords(words);
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
    <PageWrapper title={t('explorer.title')} eyebrow="Explorateur · 01">
      <p className="-mt-8 mb-12 max-w-2xl text-base text-neutral-700 dark:text-neutral-300">
        {t('explorer.subtitle')}
      </p>

      {/* Sélecteur de lettres */}
      <section className="relative border-2 border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-950 p-6 sm:p-10">
        <LetterPicker value={letters} onChange={handleLettersChange} />
      </section>

      {/* Résultat de la racine */}
      <section className="mt-14">
        {!complete && (
          <div className="border border-dashed border-neutral-300 dark:border-neutral-700 py-16 text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
              {t('explorer.selectAllLetters')}
            </p>
          </div>
        )}

        {complete && rootLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {complete && !rootLoading && rootResolved && root && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              <div className="lg:col-span-1">
                <p className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                  — Racine identifiée
                </p>
                <RootCard root={root} />
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
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0 border-b-2 border-neutral-950 dark:border-neutral-0 pb-3">
                  {t('root.derivedWords')}
                </h2>
                <div className="mt-6">
                  <WordList words={rootWords} grouped />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {complete && !rootLoading && rootResolved && !root && (
          <div className="border-2 border-dashed border-neutral-950 dark:border-neutral-0 bg-neutral-50 dark:bg-neutral-900 p-10 text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — Aucune racine trouvée
            </p>
            <p
              lang="ar"
              dir="rtl"
              className="mt-4 font-arabic text-5xl font-bold text-neutral-950 dark:text-neutral-0"
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

      <AdvancedWordSearch rootSlug={root?.slug} />

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

  const onFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const words = results?.data ?? [];
  const totalPages = results?.totalPages ?? 1;

  return (
    <section className="mt-20 border-2 border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-950 p-6 sm:p-10">
      <div className="flex items-end justify-between gap-4 border-b-2 border-neutral-950 dark:border-neutral-0 pb-4 mb-8">
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — 02 / Filtres
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
            {t('explorer.advancedSearch')}
          </h2>
        </div>
        <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          {String(results?.total ?? words.length).padStart(3, '0')} résultats
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            className={`${SELECT_CLASS} w-full disabled:opacity-50 disabled:cursor-not-allowed`}
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

      <div className="mt-4">
        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          × {t('explorer.resetFilters')}
        </Button>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        )}

        {!loading && error && (
          <p className="py-12 text-center text-sm font-semibold uppercase tracking-[0.18em] text-accent-500 dark:text-accent-300">
            {error?.message ?? t('errors.generic')}
          </p>
        )}

        {!loading && !error && words.length === 0 && (
          <div className="border border-dashed border-neutral-300 dark:border-neutral-700 py-12 text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
              {t('common.noResults')}
            </p>
          </div>
        )}

        {!loading && !error && words.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-neutral-950 dark:border-neutral-0">
              {words.map((word) => (
                <div key={word._id} className="-ml-px -mt-px">
                  <WordCard word={word} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10">
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
