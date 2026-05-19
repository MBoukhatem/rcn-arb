// EmptyState — état vide / sans résultat uniformisé.
// Espacement et style cohérents sur toute l'application.

/**
 * @param {object} props
 * @param {string} [props.eyebrow] - petit label en majuscules au-dessus.
 * @param {React.ReactNode} props.title - message principal.
 * @param {React.ReactNode} [props.description] - texte secondaire optionnel.
 * @param {React.ReactNode} [props.action] - bouton/lien d'action optionnel.
 * @param {'error'|'default'} [props.tone='default'] - 'error' teinte le message.
 * @param {string} [props.className]
 */
const EmptyState = ({
  eyebrow,
  title,
  description,
  action,
  tone = 'default',
  className = '',
}) => (
  <div
    className={`flex flex-col items-center text-center bg-neutral-50 dark:bg-neutral-900 px-6 py-16 ${className}`}
  >
    {eyebrow && (
      <p className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-accent-600 dark:text-accent-300">
        — {eyebrow}
      </p>
    )}
    <p
      className={`text-lg font-semibold tracking-tight ${
        tone === 'error'
          ? 'text-accent-600 dark:text-accent-300'
          : 'text-ink dark:text-neutral-0'
      }`}
    >
      {title}
    </p>
    {description && (
      <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
