// Page Recherche — recherche avancée des mots, séparée de l'explorateur.
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import WordForm, { EMPTY_WORD } from '@/components/word/WordForm';
import { ViewButton, EditButton, DeleteButton } from '@/components/ui/ActionButtons';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { getWords, updateWord, deleteWord } from '@/services/word.service';
import { WORD_TYPES, VERB_TENSES, getTypeLabel } from '@/utils/morphology';

const SELECT_CLASS =
  'h-11 px-3.5 text-sm bg-neutral-0 text-ink ' +
  'border border-neutral-950 dark:border-neutral-0 ' +
  'transition-colors duration-150 cursor-pointer ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/40 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 ' +
  'dark:focus:ring-accent-300/40 ' +
  'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 ' +
  'disabled:border-neutral-300 dark:disabled:bg-neutral-800 ' +
  'dark:disabled:text-neutral-600 dark:disabled:border-neutral-700';

// Puce de filtre par type — bouton "chip" sélectionnable.
const TypeChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`px-3.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.12em] transition-colors ${
      active
        ? 'bg-accent-700 text-sand-50 dark:bg-accent-400 dark:text-neutral-950'
        : 'bg-neutral-100 text-neutral-600 hover:bg-accent-700/15 hover:text-accent-700 ' +
          'dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-accent-400/20'
    }`}
  >
    {label}
  </button>
);

// Chip de filtre actif — supprimable d'un clic.
const ActiveChip = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-1.5 bg-sand-200 dark:bg-sand-700 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.1em] text-ink dark:text-sand-50 hover:bg-sand-300 dark:hover:bg-sand-600 transition-colors"
  >
    {label}
    <span aria-hidden="true" className="text-sm leading-none">
      ×
    </span>
  </button>
);

const Search = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [tense, setTense] = useState('');
  const [sortBy, setSortBy] = useState('alpha');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modales d'édition / suppression d'un mot.
  const [editWord, setEditWord] = useState(null);
  const [editValues, setEditValues] = useState(EMPTY_WORD);
  const [editSaving, setEditSaving] = useState(false);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [wordDeleting, setWordDeleting] = useState(false);

  const debouncedQ = useDebounce(q, 400);

  // Politique d'édition/suppression : réservée aux administrateurs uniquement.
  const isAdmin = user?.role === 'admin';

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sortBy, page, limit: 12 };
      if (debouncedQ.trim()) params.q = debouncedQ.trim();
      if (type) params.type = type;
      if (type === 'VERB' && tense) params.tense = tense;
      const res = await getWords(params);
      setResults(res);
    } catch (err) {
      setError(err);
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, type, tense, sortBy, page, t]);

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

  // Sélection d'un type : bascule, et réinitialise le temps si on quitte VERB.
  const selectType = (code) => {
    setType((prev) => (prev === code ? '' : code));
    if (code !== 'VERB') setTense('');
    setPage(1);
  };

  // Ouvre la modale d'édition pré-remplie avec le mot sélectionné.
  const openEdit = (w) => {
    setEditValues({
      arabic: w?.arabic ?? '',
      transliteration: w?.transliteration ?? '',
      translationFr: w?.translationFr ?? '',
      translationEn: w?.translationEn ?? '',
      type: w?.type ?? 'VERB',
      tense: w?.tense ?? 'MADI',
      pattern: w?.pattern ?? '',
      example: w?.example ?? '',
      notes: w?.notes ?? '',
    });
    setEditWord(w);
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
      await updateWord(editWord._id, payload);
      toast.success(t('word.updateSuccess'));
      setEditWord(null);
      runSearch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    setWordDeleting(true);
    try {
      await deleteWord(wordToDelete._id);
      toast.success(t('word.deleteSuccess'));
      setWordToDelete(null);
      runSearch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setWordDeleting(false);
    }
  };

  const words = results?.data ?? [];
  const totalPages = results?.totalPages ?? 1;
  const totalCount = results?.total ?? words.length;

  // Filtres actifs (pour les chips supprimables).
  const activeFilters = [
    q.trim() && {
      key: 'q',
      label: `${t('common.search')} : ${q.trim()}`,
      remove: () => setQ(''),
    },
    type && {
      key: 'type',
      label: getTypeLabel(type, t),
      remove: () => selectType(type),
    },
    type === 'VERB' &&
      tense && {
        key: 'tense',
        label: t(`morphology.tense.${tense}`),
        remove: () => setTense(''),
      },
  ].filter(Boolean);

  return (
    <PageWrapper title={t('search.title')} eyebrow={t('search.eyebrow')}>
      <p className="-mt-8 mb-12 mx-auto max-w-2xl text-center text-base text-neutral-700 dark:text-neutral-300">
        {t('search.subtitle')}
      </p>

      <section className="bg-neutral-0 dark:bg-neutral-900 px-6 sm:px-10 py-8 sm:py-10">
        {/* En-tête */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
          <div>
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-600 dark:text-sand-300">
              — {t('search.sectionEyebrow')}
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('explorer.advancedSearch')}
            </h2>
          </div>
          {/* Compteur dynamique */}
          <div className="flex items-baseline gap-2">
            <span className="font-arabic text-3xl font-bold text-accent-600 dark:text-sand-300">
              {totalCount}
            </span>
            <span className="text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {t('common.results')}
            </span>
          </div>
        </div>

        {/* Barre de filtres compacte */}
        <div className="py-2 space-y-5">
          {/* Recherche large */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M14 14l4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="text"
              name="q"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={t('explorer.searchPlaceholder')}
              className="w-full h-12 pl-11 pr-4 text-sm bg-neutral-100 dark:bg-neutral-850 text-ink dark:text-neutral-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent-500/50 dark:focus:ring-accent-300/40 transition-colors"
            />
          </div>

          {/* Chips de type */}
          <div className="flex flex-wrap gap-2">
            <TypeChip
              label={t('explorer.allTypes')}
              active={!type}
              onClick={() => selectType('')}
            />
            {WORD_TYPES.map((code) => (
              <TypeChip
                key={code}
                label={getTypeLabel(code, t)}
                active={type === code}
                onClick={() => selectType(code)}
              />
            ))}
          </div>

          {/* Ligne secondaire : temps verbal (si VERB) + tri */}
          <div className="flex flex-wrap items-center gap-4">
            {type === 'VERB' && (
              <label className="flex items-center gap-2">
                <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                  {t('explorer.tense')}
                </span>
                <select
                  value={tense}
                  onChange={(e) => {
                    setTense(e.target.value);
                    setPage(1);
                  }}
                  className={`${SELECT_CLASS} h-9`}
                >
                  <option value="">{t('explorer.allTenses')}</option>
                  {VERB_TENSES.map((code) => (
                    <option key={code} value={code}>
                      {t(`morphology.tense.${code}`)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="flex items-center gap-2">
              <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                {t('explorer.sortBy')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className={`${SELECT_CLASS} h-9`}
              >
                <option value="alpha">{t('explorer.sortAlpha')}</option>
                <option value="type">{t('explorer.sortType')}</option>
                <option value="date">{t('explorer.sortDate')}</option>
              </select>
            </label>
          </div>

          {/* Filtres actifs */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                {t('explorer.activeFilters')}
              </span>
              {activeFilters.map((f) => (
                <ActiveChip key={f.key} label={f.label} onRemove={f.remove} />
              ))}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-2xs font-semibold uppercase tracking-[0.14em] text-accent-600 dark:text-sand-300 hover:underline"
              >
                {t('explorer.resetFilters')}
              </button>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="py-8">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Spinner size="md" />
              <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                {t('common.loading')}
              </p>
            </div>
          )}

          {!loading && error && (
            <EmptyState
              tone="error"
              eyebrow={t('common.error')}
              title={error?.message ?? t('errors.generic')}
            />
          )}

          {!loading && !error && words.length === 0 && (
            <EmptyState
              title={t('common.noResults')}
              description={t('explorer.searchPlaceholder')}
              action={
                activeFilters.length > 0 ? (
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    {t('explorer.resetFilters')}
                  </Button>
                ) : undefined
              }
            />
          )}

          {!loading && !error && words.length > 0 && (
            <>
              {/* Tableau des résultats */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-100 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      <th className="px-5 py-3">{t('word.arabic')}</th>
                      <th className="px-5 py-3">{t('word.transliteration')}</th>
                      <th className="px-5 py-3">{t('explorer.type')}</th>
                      <th className="px-5 py-3">{t('word.translation')}</th>
                      <th className="px-5 py-3 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map((w) => (
                      <tr
                        key={w._id}
                        className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-sand-50 dark:hover:bg-neutral-850 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <span
                            lang="ar"
                            dir="rtl"
                            className="font-arabic text-2xl font-bold text-ink dark:text-neutral-0"
                          >
                            {w.arabic}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs italic text-neutral-600 dark:text-neutral-400">
                          {w.transliteration || '—'}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-block bg-accent-700/12 dark:bg-accent-400/15 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] text-accent-700 dark:text-accent-300">
                            {getTypeLabel(w.type, t)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                          {w.translationFr || w.translationEn || '—'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            {w._id && (
                              <ViewButton
                                to={`/words/${w._id}`}
                                label={t('explorer.viewRoot')}
                              />
                            )}
                            {isAuthenticated && (
                              <FavoriteButton item={w._id} itemModel="Word" />
                            )}
                            {isAdmin && (
                              <>
                                <EditButton onClick={() => openEdit(w)} label={t('common.edit')} />
                                <DeleteButton onClick={() => setWordToDelete(w)} label={t('common.delete')} />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* Modale d'édition d'un mot */}
      <Modal
        isOpen={!!editWord}
        onClose={() => setEditWord(null)}
        title={t('word.editWord')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditWord(null)}>
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

      {/* Modale de confirmation de suppression d'un mot */}
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
              onClick={confirmDelete}
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
            </p>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Search;
