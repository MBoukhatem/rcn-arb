// Input — champ de formulaire avec label, message d'erreur et texte d'aide.
// Design System §5.2.
import { useId } from 'react';

const INPUT_BASE =
  'w-full h-11 px-3.5 rounded-md text-sm bg-neutral-0 text-neutral-900 ' +
  'border placeholder:text-neutral-400 transition-colors duration-150 ' +
  'dark:bg-neutral-850 dark:text-neutral-50 dark:placeholder:text-neutral-500 ' +
  'focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ' +
  'disabled:bg-neutral-50 dark:disabled:bg-neutral-900';

const INPUT_NORMAL =
  'border-neutral-300 dark:border-neutral-700 focus:border-accent-600 ' +
  'focus:ring-4 focus:ring-accent-600/[0.14] dark:focus:border-accent-400 ' +
  'dark:focus:ring-accent-400/20';

const INPUT_ERROR =
  'border-error-light ring-4 ring-error-light/[0.14] ' +
  'dark:border-error-dark dark:ring-error-dark/20';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} props.name
 * @param {string} [props.type='text']
 * @param {string} [props.value]
 * @param {Function} [props.onChange]
 * @param {string} [props.error]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required]
 * @param {string} [props.hint]
 */
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
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
        >
          {label}
          {required && (
            <span className="text-error-light dark:text-error-dark ml-0.5">
              *
            </span>
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
          className="mt-1.5 text-xs font-medium text-error-light dark:text-error-dark"
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={`${inputId}-hint`}
            className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500"
          >
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default Input;
