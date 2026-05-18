// Badge — pastille pour types morphologiques et temps verbaux.
// Design System §5.3.

const BASE =
  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs ' +
  'font-semibold uppercase tracking-wide whitespace-nowrap';

// Monochrome au repos ; pourpre plein quand `accent` (= sélectionné/actif).
const MONOCHROME =
  'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';

const ACCENT = 'bg-accent-600 text-neutral-0 border border-transparent';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.accent=false] - variante pourpre (état sélectionné/actif).
 * @param {string} [props.className]
 */
const Badge = ({ children, accent = false, className = '' }) => (
  <span className={`${BASE} ${accent ? ACCENT : MONOCHROME} ${className}`}>
    {children}
  </span>
);

export default Badge;
