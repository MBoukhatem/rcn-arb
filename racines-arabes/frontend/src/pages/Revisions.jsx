// Page révisions — protégée. Liste des racines enregistrées pour révision
// et lancement d'une session de cartes recto/verso.
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import RevisionButton from '@/components/revisions/RevisionButton';
import { ViewButton } from '@/components/ui/ActionButtons';
import { useFetch } from '@/hooks/useFetch';
import { getRevisions } from '@/services/revision.service';
import { joinLetters } from '@/utils/formatters';

const Revisions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getRevisions({ page, limit: 12 }),
    [page],
  );

  const handleToggle = useCallback(() => {
    toast.success(t('revisions.removeSuccess'));
    refetch();
  }, [refetch, t]);

  const revisions = (data?.data ?? []).filter((r) => r?.root);
  const totalPages = data?.totalPages ?? 1;

  return (
    <PageWrapper title={t('revisions.title')} eyebrow={t('revisions.eyebrow')}>
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

      {!loading && !error && revisions.length === 0 && (
        <EmptyState
          eyebrow={t('revisions.emptyEyebrow')}
          title={t('revisions.empty')}
          action={
            <Button as={Link} to="/explorer" variant="primary">
              {t('nav.explorer')}
            </Button>
          }
        />
      )}

      {!loading && !error && revisions.length > 0 && (
        <div className="space-y-10">
          <section>
            <header className="flex flex-wrap items-end justify-between gap-4 pb-4 mb-6">
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                  — {t('revisions.section01')}
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
                  {t('revisions.heading')}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {String(revisions.length).padStart(2, '0')} {t('common.entries')}
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/revisions/session')}
                >
                  {t('revisions.startSession')} →
                </Button>
              </div>
            </header>

            <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    <th className="px-5 py-2.5">{t('root.letters')}</th>
                    <th className="px-5 py-2.5">{t('root.slugLabel')}</th>
                    <th className="px-5 py-2.5">{t('root.meaningFr')}</th>
                    <th className="px-5 py-2.5">{t('revisions.reviewCount')}</th>
                    <th className="px-5 py-2.5 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revisions.map((rev) => {
                    const r = rev.root ?? {};
                    const letters = r.letters ?? (r.slug ? r.slug.split('-') : []);
                    return (
                      <tr
                        key={rev._id}
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
                        <td className="px-5 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {String(rev.reviewCount ?? 0).padStart(2, '0')}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            {r.slug && (
                              <ViewButton
                                to={`/roots/${r.slug}`}
                                label={t('explorer.viewRoot')}
                              />
                            )}
                            <RevisionButton
                              root={r._id}
                              isRevised
                              revisionId={rev._id}
                              onToggle={handleToggle}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default Revisions;
