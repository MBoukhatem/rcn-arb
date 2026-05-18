// FavoriteButton — bouton favori graphique : carré, sans border-radius.
import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { addFavorite, removeFavorite } from '@/services/favorite.service';
import Spinner from '@/components/ui/Spinner';

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

  const stateClasses = isFavorited
    ? 'bg-accent-500 text-neutral-0 border-accent-500 dark:bg-accent-300 dark:text-neutral-950 dark:border-accent-300'
    : 'bg-neutral-0 text-neutral-950 border-neutral-950 hover:bg-neutral-950 hover:text-neutral-0 dark:bg-neutral-950 dark:text-neutral-0 dark:border-neutral-0 dark:hover:bg-neutral-0 dark:hover:text-neutral-950';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={label}
      aria-pressed={isFavorited}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300 disabled:pointer-events-none ${stateClasses}`}
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
          >
            <svg
              className="h-4 w-4"
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
