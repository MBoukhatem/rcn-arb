// Button — boutons strictement noirs ou blancs, sans bordure ni border-radius.
// Design éditorial : typographie compacte, lettrage espacé.
import Spinner from '@/components/ui/Spinner';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold uppercase ' +
  'tracking-[0.14em] transition-all duration-150 ease-snappy ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-accent-500 focus-visible:ring-offset-neutral-0 ' +
  'dark:focus-visible:ring-offset-neutral-950 select-none active:translate-y-px ' +
  // État désactivé : couleurs explicites (pas d'opacité) pour rester lisible.
  'disabled:pointer-events-none disabled:bg-neutral-200 disabled:text-neutral-400 ' +
  'disabled:border-neutral-200 dark:disabled:bg-neutral-800 ' +
  'dark:disabled:text-neutral-600 dark:disabled:border-neutral-800';

const SIZES = {
  sm: 'h-9 px-4 text-2xs',
  md: 'h-11 px-6 text-xs',
  lg: 'h-14 px-8 text-xs',
};

// Variants : palette vert sapin / sable. Aucun noir.
const VARIANTS = {
  // Plein vert sapin, texte crème → plus clair en sombre.
  primary:
    'bg-accent-700 text-sand-50 hover:bg-accent-600 ' +
    'dark:bg-accent-500 dark:text-neutral-950 dark:hover:bg-accent-400',
  // Contour vert, fond transparent → remplissage à l'hover.
  secondary:
    'bg-transparent text-accent-700 border border-accent-700 ' +
    'hover:bg-accent-700 hover:text-sand-50 ' +
    'dark:text-sand-200 dark:border-sand-300 ' +
    'dark:hover:bg-sand-300 dark:hover:text-neutral-950',
  // Transparent, remplissage vert doux à l'hover.
  ghost:
    'bg-transparent text-accent-700 ' +
    'hover:bg-accent-700/10 hover:text-accent-800 ' +
    'dark:text-sand-200 dark:hover:bg-sand-300/15',
  // Action critique : teinté brique.
  danger:
    'bg-error-light/10 text-error-light ' +
    'hover:bg-error-light hover:text-sand-50 ' +
    'dark:bg-error-dark/15 dark:text-error-dark ' +
    'dark:hover:bg-error-dark dark:hover:text-neutral-950',
};

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
      {loading && <Spinner size="sm" />}
      {children}
    </Component>
  );
};

export default Button;
