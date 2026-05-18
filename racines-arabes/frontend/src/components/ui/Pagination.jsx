// Pagination — contrôles de navigation entre pages.
// Design System §5.5.
import { useTranslation } from 'react-i18next';

const PAGE_BTN =
  'min-w-9 h-9 px-2 rounded-md text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 ' +
  'dark:focus-visible:ring-accent-400';

const INACTIVE =
  'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800';

const ACTIVE =
  'bg-accent-600 text-neutral-0 hover:bg-accent-600 dark:bg-accent-600 dark:text-neutral-0';

const ARROW =
  'inline-flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none';

// Construit la liste de pages affichées, avec ellipses pour les grands totaux.
const buildPages = (page, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push('start-ellipsis');
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push('end-ellipsis');
  pages.push(total);
  return pages;
};

/**
 * @param {object} props
 * @param {number} props.page - page courante (1-indexée).
 * @param {number} props.totalPages
 * @param {Function} props.onPageChange - reçoit le nouveau numéro de page.
 */
const Pagination = ({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  // Ne rend rien s'il n'y a au plus qu'une page.
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);
  const go = (target) => {
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange?.(target);
    }
  };

  return (
    <nav
      className="flex items-center justify-center gap-1.5"
      aria-label={t('common.page')}
    >
      <button
        type="button"
        className={`${PAGE_BTN} ${INACTIVE} ${ARROW}`}
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label={t('common.previous')}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 4l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {pages.map((item) =>
        typeof item === 'string' ? (
          <span
            key={item}
            className="text-neutral-400 dark:text-neutral-500 px-1 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${PAGE_BTN} ${item === page ? ACTIVE : INACTIVE}`}
            onClick={() => go(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`${t('common.page')} ${item}`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={`${PAGE_BTN} ${INACTIVE} ${ARROW}`}
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 4l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500 select-none">
        {t('common.page')} {page} {t('common.of')} {totalPages}
      </span>
    </nav>
  );
};

export default Pagination;
