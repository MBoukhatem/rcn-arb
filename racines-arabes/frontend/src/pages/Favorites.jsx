// Page favoris — protégée. Racines et mots favoris de l'utilisateur,
// présentés en tableaux cohérents avec ceux des mots dérivés.
// Chaque ligne offre : Voir · Favori (actif) · Modifier · Supprimer.
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import RevisionButton from '@/components/revisions/RevisionButton';
import RootForm, { EMPTY_ROOT } from '@/components/root/RootForm';
import WordForm, { EMPTY_WORD } from '@/components/word/WordForm';
import {
  ViewButton,
  EditButton,
  DeleteButton,
} from '@/components/ui/ActionButtons';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getFavorites } from '@/services/favorite.service';
import { updateRoot, deleteRoot } from '@/services/root.service';
import { updateWord, deleteWord } from '@/services/word.service';
import { getTypeLabel } from '@/utils/morphology';
import { joinLetters } from '@/utils/formatters';

const Favorites = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getFavorites({ page, limit: 12 }),
    [page],
  );

  const handleToggle = useCallback(() => {
    toast.success(t('favorites.removeSuccess'));
    refetch();
  }, [refetch, t]);

  const favorites = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const roots = favorites.filter((f) => f?.itemModel === 'Root');
  const words = favorites.filter((f) => f?.itemModel === 'Word');

  // Politique d'édition/suppression : réservée aux administrateurs uniquement.
  const isAdmin = user?.role === 'admin';

  // ────────── Édition / suppression de racines ──────────
  const [editRoot, setEditRoot] = useState(null);
  const [editRootValues, setEditRootValues] = useState(EMPTY_ROOT);
  const [editRootSaving, setEditRootSaving] = useState(false);
  const [rootToDelete, setRootToDelete] = useState(null);
  const [rootDeleting, setRootDeleting] = useState(false);

  const openEditRoot = (r) => {
    setEditRootValues({
      meaningFr: r?.meaningFr ?? '',
      meaningEn: r?.meaningEn ?? '',
      meaningAr: r?.meaningAr ?? '',
    });
    setEditRoot(r);
  };

  const submitEditRoot = async () => {
    if (!editRootValues.meaningFr.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    setEditRootSaving(true);
    try {
      await updateRoot(editRoot.slug, editRootValues);
      toast.success(t('root.updateSuccess'));
      setEditRoot(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditRootSaving(false);
    }
  };

  const confirmDeleteRoot = async () => {
    setRootDeleting(true);
    try {
      await deleteRoot(rootToDelete.slug);
      toast.success(t('root.deleteSuccess'));
      setRootToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setRootDeleting(false);
    }
  };

  // ────────── Édition / suppression de mots ──────────
  const [editWord, setEditWord] = useState(null);
  const [editWordValues, setEditWordValues] = useState(EMPTY_WORD);
  const [editWordSaving, setEditWordSaving] = useState(false);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [wordDeleting, setWordDeleting] = useState(false);

  const openEditWord = (w) => {
    setEditWordValues({
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

  const submitEditWord = async () => {
    if (!editWordValues.arabic.trim() || !editWordValues.pattern.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    if (editWordValues.type === 'VERB' && !editWordValues.tense) {
      toast.error(t('word.tenseRequired'));
      return;
    }
    const payload = { ...editWordValues };
    if (payload.type !== 'VERB') delete payload.tense;

    setEditWordSaving(true);
    try {
      await updateWord(editWord._id, payload);
      toast.success(t('word.updateSuccess'));
      setEditWord(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditWordSaving(false);
    }
  };

  const confirmDeleteWord = async () => {
    setWordDeleting(true);
    try {
      await deleteWord(wordToDelete._id);
      toast.success(t('word.deleteSuccess'));
      setWordToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setWordDeleting(false);
    }
  };

  return (
    <PageWrapper title={t('favorites.title')} eyebrow={t('favorites.eyebrow')}>
      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
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

      {!loading && !error && favorites.length === 0 && (
        <EmptyState
          eyebrow={t('favorites.emptyEyebrow')}
          title={t('favorites.empty')}
          action={
            <Button as={Link} to="/explorer" variant="primary">
              {t('nav.explorer')}
            </Button>
          }
        />
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="space-y-16">
          {/* ── Racines favorites ─────────────────────────────────── */}
          {roots.length > 0 && (
            <section>
              <header className="flex items-end justify-between gap-4 pb-4 mb-6">
                <div>
                  <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                    — {t('favorites.section01')}
                  </p>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
                    {t('favorites.roots')}
                  </h2>
                </div>
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {String(roots.length).padStart(2, '0')} {t('common.entries')}
                </span>
              </header>

              <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      <th className="px-5 py-2.5">{t('root.letters')}</th>
                      <th className="px-5 py-2.5">{t('root.slugLabel')}</th>
                      <th className="px-5 py-2.5">{t('root.meaningFr')}</th>
                      <th className="px-5 py-2.5">{t('root.meaningEn')}</th>
                      <th className="px-5 py-2.5 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roots.map((fav) => {
                      const r = fav.item ?? {};
                      const letters = r.letters ?? (r.slug ? r.slug.split('-') : []);
                      return (
                        <tr
                          key={fav._id}
                          className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-sand-50 dark:hover:bg-neutral-850 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <span
                              lang="ar"
                              dir="rtl"
                              className="font-arabic text-2xl font-bold text-ink dark:text-neutral-0"
                            >
                              {joinLetters(letters)}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-accent-600 dark:text-accent-300">
                            [ {r.slug ?? '—'} ]
                          </td>
                          <td className="px-5 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                            {r.meaningFr || '—'}
                          </td>
                          <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                            {r.meaningEn || '—'}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              {r.slug && (
                                <ViewButton
                                  to={`/roots/${r.slug}`}
                                  label={t('explorer.viewRoot')}
                                />
                              )}
                              <FavoriteButton
                                item={r._id}
                                itemModel="Root"
                                isFavorited
                                favoriteId={fav._id}
                                onToggle={handleToggle}
                              />
                              <RevisionButton root={r._id} />
                              {isAdmin && (
                                <>
                                  <EditButton
                                    onClick={() => openEditRoot(r)}
                                    label={t('common.edit')}
                                  />
                                  <DeleteButton
                                    onClick={() => setRootToDelete(r)}
                                    label={t('common.delete')}
                                  />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Mots favoris ─────────────────────────────────────── */}
          {words.length > 0 && (
            <section>
              <header className="flex items-end justify-between gap-4 pb-4 mb-6">
                <div>
                  <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                    — {t('favorites.section02')}
                  </p>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
                    {t('favorites.words')}
                  </h2>
                </div>
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {String(words.length).padStart(2, '0')} {t('common.entries')}
                </span>
              </header>

              <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      <th className="px-5 py-2.5">{t('word.arabic')}</th>
                      <th className="px-5 py-2.5">{t('word.transliteration')}</th>
                      <th className="px-5 py-2.5">{t('explorer.type')}</th>
                      <th className="px-5 py-2.5">{t('word.translation')}</th>
                      <th className="px-5 py-2.5 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map((fav) => {
                      const w = fav.item ?? {};
                      return (
                        <tr
                          key={fav._id}
                          className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-sand-50 dark:hover:bg-neutral-850 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <span
                              lang="ar"
                              dir="rtl"
                              className="font-arabic text-2xl font-bold text-ink dark:text-neutral-0"
                            >
                              {w.arabic || '—'}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs italic text-neutral-600 dark:text-neutral-400">
                            {w.transliteration || '—'}
                          </td>
                          <td className="px-5 py-3">
                            {w.type ? (
                              <span className="inline-block bg-accent-700/12 dark:bg-accent-400/15 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] text-accent-700 dark:text-accent-300">
                                {getTypeLabel(w.type, t)}
                              </span>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
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
                              <FavoriteButton
                                item={w._id}
                                itemModel="Word"
                                isFavorited
                                favoriteId={fav._id}
                                onToggle={handleToggle}
                              />
                              {isAdmin && (
                                <>
                                  <EditButton
                                    onClick={() => openEditWord(w)}
                                    label={t('common.edit')}
                                  />
                                  <DeleteButton
                                    onClick={() => setWordToDelete(w)}
                                    label={t('common.delete')}
                                  />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      {/* ── Modales racine ────────────────────────────────────────── */}
      <Modal
        isOpen={!!editRoot}
        onClose={() => setEditRoot(null)}
        title={t('root.editRoot')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditRoot(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitEditRoot}
              loading={editRootSaving}
              disabled={editRootSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <RootForm values={editRootValues} onChange={setEditRootValues} />
      </Modal>

      <Modal
        isOpen={!!rootToDelete}
        onClose={() => setRootToDelete(null)}
        title={t('root.deleteRoot')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRootToDelete(null)}>
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

      {/* ── Modales mot ───────────────────────────────────────────── */}
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
              onClick={submitEditWord}
              loading={editWordSaving}
              disabled={editWordSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <WordForm values={editWordValues} onChange={setEditWordValues} />
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
            </p>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Favorites;
