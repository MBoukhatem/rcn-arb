// BackLink — lien de retour standardisé : flèche + libellé en majuscules.
// Usage :
//   <BackLink to="/explorer" label="Explorateur" />
import { Link } from 'react-router-dom';

const BackLink = ({ to, label, className = '' }) => (
  <Link
    to={to}
    className={`inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em] text-accent-600 dark:text-sand-300 hover:text-accent-700 dark:hover:text-sand-200 transition-colors ${className}`}
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill="none"
    >
      <path
        d="M12 4l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {label}
  </Link>
);

export default BackLink;
