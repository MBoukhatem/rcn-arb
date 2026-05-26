// Bloc statistiques de révision — affiché au-dessus de la liste des racines
// enregistrées. Montre le score global, le total de cartes vues, et la
// répartition par catégorie de rating.
import { useTranslation } from 'react-i18next';

// Même palette que la session pour rester cohérent.
const RATING_COLORS = {
  miss: 'text-error-light dark:text-error-dark',
  hard: 'text-orange-500',
  medium: 'text-amber-500',
  easy: 'text-emerald-600 dark:text-emerald-500',
};

const RevisionStats = ({ stats }) => {
  const { t } = useTranslation();

  if (!stats) return null;

  const { totals = {}, totalReviews = 0, globalScore } = stats;

  return (
    <section className="mb-10">
      <header className="pb-4 mb-4">
        <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
          — {t('revisions.statsEyebrow')}
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
          {t('revisions.statsTitle')}
        </h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Score global */}
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-6 flex flex-col items-center justify-center">
          <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            {t('revisions.globalScore')}
          </p>
          {globalScore !== null && globalScore !== undefined ? (
            <p className="mt-2 font-mono text-5xl font-extrabold tabular-nums text-accent-700 dark:text-accent-300">
              {globalScore}
              <span className="text-xl text-neutral-400 dark:text-neutral-500">/100</span>
            </p>
          ) : (
            <p className="mt-2 font-mono text-3xl font-bold text-neutral-400 dark:text-neutral-500">
              —
            </p>
          )}
          <p className="mt-3 text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {t('revisions.totalReviews', { count: totalReviews })}
          </p>
        </div>

        {/* Répartition par rating */}
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-6">
          <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            {t('revisions.distribution')}
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {['miss', 'hard', 'medium', 'easy'].map((key) => (
              <div key={key} className="text-center">
                <p className="text-2xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  {t(`revisions.rating.${key}`)}
                </p>
                <p
                  className={`mt-1 font-mono text-2xl font-bold tabular-nums ${RATING_COLORS[key]}`}
                >
                  {String(totals[key] ?? 0).padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevisionStats;
