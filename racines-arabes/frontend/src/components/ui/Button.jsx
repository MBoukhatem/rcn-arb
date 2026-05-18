// Button — boutons strictement noirs ou blancs, sans border-radius.
// Design éditorial : typographie compacte, lettrage espacé.
import Spinner from '@/components/ui/Spinner';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold uppercase ' +
  'tracking-[0.14em] transition-all duration-150 ease-snappy ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-accent-500 focus-visible:ring-offset-neutral-0 ' +
  'dark:focus-visible:ring-offset-neutral-950 disabled:opacity-40 ' +
  'disabled:pointer-events-none select-none active:translate-y-px ' +
  'border';

const SIZES = {
  sm: 'h-9 px-4 text-2xs',
  md: 'h-11 px-6 text-xs',
  lg: 'h-14 px-8 text-xs',
};

// Variants : tous strictement noir ou blanc.
const VARIANTS = {
  // Bloc noir, texte blanc (clair) → inversé en sombre.
  primary:
    'bg-neutral-950 text-neutral-0 border-neutral-950 ' +
    'hover:bg-neutral-800 hover:border-neutral-800 ' +
    'dark:bg-neutral-0 dark:text-neutral-950 dark:border-neutral-0 ' +
    'dark:hover:bg-neutral-100 dark:hover:border-neutral-100',
  // Bloc blanc, texte noir, bordure noire (clair) → inversé.
  secondary:
    'bg-neutral-0 text-neutral-950 border-neutral-950 ' +
    'hover:bg-neutral-950 hover:text-neutral-0 ' +
    'dark:bg-neutral-950 dark:text-neutral-0 dark:border-neutral-0 ' +
    'dark:hover:bg-neutral-0 dark:hover:text-neutral-950',
  // Transparent, sans bordure, soulignement à l'hover.
  ghost:
    'bg-transparent text-neutral-950 border-transparent ' +
    'hover:bg-neutral-950 hover:text-neutral-0 ' +
    'dark:text-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950',
  // Discrètement teinté d'accent (pourpre rougeâtre) pour les actions critiques.
  danger:
    'bg-transparent text-accent-500 border-accent-500 ' +
    'hover:bg-accent-500 hover:text-neutral-0 ' +
    'dark:text-accent-300 dark:border-accent-300 ' +
    'dark:hover:bg-accent-300 dark:hover:text-neutral-950',
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
