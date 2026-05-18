// FavoriteButton — bouton cœur d'ajout/retrait de favori.
// Design System §5.9 (favori plein pourpre / vide contour, micro-animation scale-in).
import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { addFavorite, removeFavorite } from '@/services/favorite.service';
import Spinner from '@/components/ui/Spinner';

/**
 * @param {object} props
 * @param {string} props.item - id de l'élément (racine ou mot).
 * @param {'Root'|'Word'} props.itemModel - modèle ciblé.
 * @param {boolean} [props.isFavorited=false]
 * @param {string} [props.favoriteId] - id du favori (requis pour le retrait).
 * @param {Function} [props.onToggle] - appelé après mutation pour rafraîchir le parent.
 */
const FavoriteButton = ({
  item,
  itemModel,
  isFavorited = false,
  favoriteId,
  onToggle,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const shouldReduce = useReducedMotion();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    async (event) => {
      // Empêche le clic de carte parente (Link) de se déclencher.
      event.preventDefault();
      event.stopPropagation();

      if (loading) return;

      if (!isAuthenticated) {
        toast.error(t('errors.unauthorized'));
        return;
      }

      setLoading(true);
      try {
        if (isFavorited) {
          await removeFavorite(favoriteId);
          toast.success(t('favorites.removeSuccess'));
        } else {
          await addFavorite({ item, itemModel });
          toast.success(t('favorites.addSuccess'));
        }
        onToggle?.();
      } catch {
        toast.error(t('errors.generic'));
      } finally {
        setLoading(false);
      }
    },
    [loading, isAuthenticated, isFavorited, favoriteId, item, itemModel, onToggle, t],
  );

  const label = isFavorited
    ? t('word.removeFromFavorites')
    : t('word.addToFavorites');

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={label}
      aria-pressed={isFavorited}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 text-neutral-400 hover:text-accent-600 hover:bg-neutral-100 dark:hover:text-accent-400 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400 disabled:pointer-events-none"
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isFavorited ? 'filled' : 'empty'}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={isFavorited ? 'text-accent-600 dark:text-accent-400' : ''}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill={isFavorited ? 'currentColor' : 'none'}
              aria-hidden="true"
            >
              <path
                d="M10 17.5l-1.45-1.32C3.4 11.5 0.5 8.86 0.5 5.62 0.5 3 2.54 1 5.13 1 6.6 1 8.01 1.68 10 3.4 11.99 1.68 13.4 1 14.87 1 17.46 1 19.5 3 19.5 5.62c0 3.24-2.9 5.88-8.05 10.56L10 17.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
};

export default FavoriteButton;
