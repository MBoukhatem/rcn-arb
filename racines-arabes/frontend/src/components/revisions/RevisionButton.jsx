// RevisionButton — ajoute / retire une racine de la liste de révision.
// Style aligné sur FavoriteButton : carré, sans border-radius, mais teinte
// turquoise (accent) à l'état actif au lieu du rouge des favoris.
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { addRevision, removeRevision } from '@/services/revision.service';
import Spinner from '@/components/ui/Spinner';

const RevisionButton = ({
  root,
  isRevised = false,
  revisionId,
  onToggle,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const shouldReduce = useReducedMotion();
  const [loading, setLoading] = useState(false);

  const [revised, setRevised] = useState(isRevised);
  const [localRevisionId, setLocalRevisionId] = useState(revisionId ?? null);

  useEffect(() => setRevised(isRevised), [isRevised]);
  useEffect(() => setLocalRevisionId(revisionId ?? null), [revisionId]);

  const handleClick = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (loading) return;

      if (!isAuthenticated) {
        toast.error(t('errors.unauthorized'));
        return;
      }

      setLoading(true);
      try {
        if (revised) {
          if (localRevisionId) {
            await removeRevision(localRevisionId);
          }
          setRevised(false);
          setLocalRevisionId(null);
          toast.success(t('revisions.removeSuccess'));
        } else {
          const createdRev = await addRevision({ root });
          setRevised(true);
          setLocalRevisionId(createdRev?._id ?? null);
          toast.success(t('revisions.addSuccess'));
        }
        onToggle?.();
      } catch (err) {
        if (err?.status === 409 && !revised) {
          setRevised(true);
          toast.success(t('revisions.addSuccess'));
        } else {
          toast.error(err?.message ?? t('errors.generic'));
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, isAuthenticated, revised, localRevisionId, root, onToggle, t],
  );

  const label = revised
    ? t('revisions.removeFromRevisions')
    : t('revisions.addToRevisions');

  // Actif : fond accent (turquoise) plein + icône sable.
  // Repos : neutres alignés sur le bouton favori voisin.
  // Hover : sable doré (cohérence avec FavoriteButton).
  const stateClasses = revised
    ? 'bg-accent-700 text-sand-50 border-accent-700 dark:bg-accent-600 dark:text-sand-50 dark:border-accent-600'
    : 'bg-neutral-0 text-ink border-neutral-950 hover:bg-sand-300 hover:text-accent-800 hover:border-sand-400 dark:bg-neutral-900 dark:text-neutral-0 dark:border-neutral-0 dark:hover:bg-sand-300 dark:hover:text-accent-900 dark:hover:border-sand-300';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={label}
      aria-pressed={revised}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300 disabled:pointer-events-none ${stateClasses}`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={revised ? 'on' : 'off'}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icône "carte d'étude" : deux rectangles empilés. */}
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4.25"
                y="6.25"
                width="11.5"
                height="9"
                rx="0.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill={revised ? 'currentColor' : 'none'}
              />
              <path
                d="M6.5 4.25h9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
};

export default RevisionButton;
