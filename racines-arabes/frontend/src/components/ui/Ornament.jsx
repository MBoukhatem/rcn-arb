// Ornament — séparateur décoratif floral en losange (motif persan).
// Deux filets encadrant une étoile à 8 branches.

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.center=false] - centre l'ornement (mx-auto).
 */
const Ornament = ({ className = '', center = false }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center gap-2 text-sand-500 dark:text-sand-300 ${
      center ? 'mx-auto' : ''
    } ${className}`}
  >
    <span className="h-px w-10 bg-current opacity-60" />
    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
    </svg>
    <span className="h-px w-10 bg-current opacity-60" />
  </span>
);

export default Ornament;
