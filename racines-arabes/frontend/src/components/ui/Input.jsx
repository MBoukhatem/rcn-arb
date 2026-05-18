// Input — champ de formulaire éditorial, bordure stricte, sans border-radius.
import { useId } from 'react';

const INPUT_BASE =
  'w-full h-11 px-3.5 text-sm bg-neutral-0 text-neutral-950 ' +
  'border placeholder:text-neutral-400 transition-colors duration-150 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 dark:placeholder:text-neutral-600 ' +
  'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ' +
  'disabled:bg-neutral-50 dark:disabled:bg-neutral-850';

const INPUT_NORMAL =
  'border-neutral-950 dark:border-neutral-0 ' +
  'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/40 ' +
  'dark:focus:border-accent-300 dark:focus:ring-accent-300/30';

const INPUT_ERROR =
  'border-accent-500 ring-2 ring-accent-500/30 ' +
  'dark:border-accent-300 dark:ring-accent-300/30';

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
          className="block text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-950 dark:text-neutral-0 mb-2"
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
