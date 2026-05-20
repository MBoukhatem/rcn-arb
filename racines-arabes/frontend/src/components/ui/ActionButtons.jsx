// ActionButtons — boutons d'action standardisés pour les tables de l'app.
// Cohérents avec le bouton favori : carré 36×36, sans border-radius, focus turquoise.
//   - ViewButton   : Link "œil" (lecture), hover sable doré.
//   - EditButton   : crayon (modification), hover turquoise plein.
//   - DeleteButton : poubelle (suppression), bordure & hover rouge.
import { Link } from 'react-router-dom';

const SQUARE_BASE =
  'inline-flex h-9 w-9 items-center justify-center border transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300';

const VIEW_CLASSES =
  'border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-900 ' +
  'text-ink dark:text-neutral-0 ' +
  'hover:bg-sand-300 hover:text-accent-800 hover:border-sand-400 ' +
  'dark:hover:bg-sand-300 dark:hover:text-accent-900 dark:hover:border-sand-300';

const EDIT_CLASSES =
  'border-neutral-950 dark:border-neutral-0 bg-neutral-0 dark:bg-neutral-900 ' +
  'text-ink dark:text-neutral-0 ' +
  'hover:bg-accent-700 hover:text-sand-50 hover:border-accent-700 ' +
  'dark:hover:bg-accent-500 dark:hover:text-neutral-950 dark:hover:border-accent-500';

const DELETE_CLASSES =
  'border-error-light dark:border-error-dark bg-neutral-0 dark:bg-neutral-900 ' +
  'text-error-light dark:text-error-dark ' +
  'hover:bg-error-light hover:text-sand-50 ' +
  'dark:hover:bg-error-dark dark:hover:text-sand-50';

export const ViewButton = ({ to, label }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    className={`${SQUARE_BASE} ${VIEW_CLASSES}`}
  >
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M1.5 10s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6S1.5 10 1.5 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </Link>
);

export const EditButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`${SQUARE_BASE} ${EDIT_CLASSES}`}
  >
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 17h4l9-9-4-4-9 9v4zM12 5l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export const DeleteButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`${SQUARE_BASE} ${DELETE_CLASSES}`}
  >
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11M9 9v6M11 9v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);
