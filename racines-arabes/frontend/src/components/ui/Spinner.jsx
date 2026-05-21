// Spinner — indicateur de chargement animé, monochrome avec accent pourpre.
// Design System §5.6.
import { useTranslation } from 'react-i18next';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-9 w-9',
};

/**
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
const Spinner = ({ size = 'md', className = '' }) => {
  const { t } = useTranslation();
  const dimension = SIZES[size] ?? SIZES.md;

  return (
    <svg
      className={`animate-spin-slow ${dimension} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={t('common.loading')}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        className="opacity-100"
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Spinner;
