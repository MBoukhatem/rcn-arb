// Badge — pastille graphique : majuscules espacées, sans border-radius.

const BASE =
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-semibold ' +
  'uppercase tracking-[0.16em] whitespace-nowrap border';

const MONOCHROME =
  'bg-neutral-0 text-neutral-950 border-neutral-950 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 dark:border-neutral-0';

const ACCENT =
  'bg-neutral-950 text-neutral-0 border-neutral-950 ' +
  'dark:bg-neutral-0 dark:text-neutral-950 dark:border-neutral-0';

const Badge = ({ children, accent = false, className = '' }) => (
  <span className={`${BASE} ${accent ? ACCENT : MONOCHROME} ${className}`}>
    <span aria-hidden="true">[</span>
    {children}
    <span aria-hidden="true">]</span>
  </span>
);

export default Badge;
