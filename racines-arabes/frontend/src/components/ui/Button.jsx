// Button — bouton stylé maison (variants, tailles, états loading/disabled).
// Design System §5.1.
import Spinner from '@/components/ui/Spinner';

// Conteneur de base commun à tous les variants.
const BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md ' +
  'transition-all duration-150 ease-snappy focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 ' +
  'disabled:pointer-events-none select-none active:scale-[0.98]';

const SIZES = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-7 text-base',
};

const VARIANTS = {
  primary:
    'bg-accent-600 text-neutral-0 hover:bg-accent-700 dark:bg-accent-600 ' +
    'dark:text-neutral-0 dark:hover:bg-accent-500 ring-accent-600 ' +
    'dark:ring-accent-400 ring-offset-neutral-0 dark:ring-offset-neutral-900',
  secondary:
    'bg-neutral-0 text-neutral-900 border border-neutral-300 ' +
    'hover:bg-neutral-50 hover:border-neutral-400 dark:bg-neutral-800 ' +
    'dark:text-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-700 ' +
    'ring-accent-600 dark:ring-accent-400 ring-offset-neutral-0 dark:ring-offset-neutral-900',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 ' +
    'dark:text-neutral-300 dark:hover:bg-neutral-800 ring-accent-600 ' +
    'dark:ring-accent-400 ring-offset-neutral-0 dark:ring-offset-neutral-900',
  danger:
    'bg-transparent text-error-light border border-error-light/40 ' +
    'hover:bg-error-light/[0.08] dark:text-error-dark dark:border-error-dark/40 ' +
    'dark:hover:bg-error-dark/[0.12] ring-error-light dark:ring-error-dark ' +
    'ring-offset-neutral-0 dark:ring-offset-neutral-900',
};

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.disabled]
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {React.ElementType} [props.as] - composant de rendu alternatif (ex. Link).
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
  as: Component = 'button',
  ...rest
}) => {
  const isInteractiveDisabled = disabled || loading;
  const classes = `${BASE} ${SIZES[size] ?? SIZES.md} ${
    VARIANTS[variant] ?? VARIANTS.primary
  } ${loading ? 'pointer-events-none' : ''} ${className}`;

  // Le spinner du bouton primary est blanc ; sinon il prend l'accent.
  const spinnerClass = variant === 'primary' ? 'text-neutral-0' : '';

  // Props spécifiques au <button> natif uniquement.
  const nativeProps =
    Component === 'button'
      ? { type, disabled: isInteractiveDisabled }
      : { 'aria-disabled': isInteractiveDisabled || undefined };

  return (
    <Component
      className={classes}
      onClick={isInteractiveDisabled ? undefined : onClick}
      {...nativeProps}
      {...rest}
    >
      {loading && <Spinner size="sm" className={spinnerClass} />}
      {children}
    </Component>
  );
};

export default Button;
