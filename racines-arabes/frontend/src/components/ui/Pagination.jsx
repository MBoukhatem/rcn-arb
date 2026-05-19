// Pagination — contrôles graphiques carrés, sans border-radius.
import { useTranslation } from 'react-i18next';

const PAGE_BTN =
  'min-w-10 h-10 px-2 text-2xs font-semibold uppercase tracking-[0.14em] transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ' +
  'dark:focus-visible:ring-accent-300';

const INACTIVE =
  'text-neutral-700 hover:bg-neutral-950 hover:text-neutral-0 ' +
  'dark:text-neutral-300 dark:hover:bg-neutral-0 dark:hover:text-neutral-950';

const ACTIVE =
  'bg-neutral-950 text-neutral-0 ' +
  'dark:bg-neutral-0 dark:text-neutral-950';

const ARROW =
  'inline-flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none';

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

const Pagination = ({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);
  const go = (target) => {
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange?.(target);
    }
  };

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label={t('common.page')}
    >
      <button
        type="button"
        className={`${PAGE_BTN} ${INACTIVE} ${ARROW}`}
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label={t('common.previous')}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
            className="text-neutral-400 dark:text-neutral-600 px-1 select-none"
            aria-hidden="true"
          >
            ···
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
            {String(item).padStart(2, '0')}
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
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 4l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="ml-3 text-2xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 select-none">
        {String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </span>
    </nav>
  );
};

export default Pagination;
