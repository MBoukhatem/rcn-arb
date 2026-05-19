// Input — champ de formulaire éditorial, sans bordure ni border-radius.
// Distinction par un fond contrasté ; focus marqué par un ring.
import { useId } from 'react';

const INPUT_BASE =
  'w-full h-11 px-3.5 text-sm text-ink ' +
  'placeholder:text-neutral-400 transition-colors duration-150 ' +
  'dark:text-neutral-0 dark:placeholder:text-neutral-600 ' +
  'focus:outline-none disabled:cursor-not-allowed ' +
  // Désactivé : couleurs explicites pour rester lisible.
  'disabled:bg-neutral-100 disabled:text-neutral-400 ' +
  'dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600';

const INPUT_NORMAL =
  'bg-neutral-100 dark:bg-neutral-800 ' +
  'focus:ring-2 focus:ring-accent-500/50 ' +
  'dark:focus:ring-accent-300/40';

const INPUT_ERROR =
  'bg-accent-500/10 ring-2 ring-accent-500/40 ' +
  'dark:bg-accent-300/10 dark:ring-accent-300/40';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  hint,
  className = '',
  ...rest
}) => {
  const reactId = useId();
  const inputId = `${name}-${reactId}`;
  const describedById = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2"
        >
          {label}
          {required && (
            <span className="text-accent-500 dark:text-accent-300 ml-1">*</span>
          )}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedById}
        className={`${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_NORMAL}`}
        {...rest}
      />

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 text-2xs font-semibold uppercase tracking-[0.14em] text-accent-500 dark:text-accent-300"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={`${inputId}-hint`}
            className="mt-2 text-2xs text-neutral-500 dark:text-neutral-400"
          >
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default Input;
