// FavoriteButton — bouton favori graphique : carré, sans border-radius.
// Cœur rouge au hover et à l'état actif (même rouge que les actions "Supprimer").
import { useState, useCallback, useEffect } from 'react';
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

  // État local : permet au cœur de basculer immédiatement après le clic,
  // même si le parent ne resynchronise pas la prop `isFavorited`.
  const [favored, setFavored] = useState(isFavorited);
  const [localFavoriteId, setLocalFavoriteId] = useState(favoriteId ?? null);

  // Resync si le parent change réellement la prop (rare ici).
  useEffect(() => setFavored(isFavorited), [isFavorited]);
  useEffect(() => setLocalFavoriteId(favoriteId ?? null), [favoriteId]);

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
        if (favored) {
          if (localFavoriteId) {
            await removeFavorite(localFavoriteId);
          }
          setFavored(false);
          setLocalFavoriteId(null);
          toast.success(t('favorites.removeSuccess'));
        } else {
          const created = await addFavorite({ item, itemModel });
          setFavored(true);
          setLocalFavoriteId(created?._id ?? null);
          toast.success(t('favorites.addSuccess'));
        }
        onToggle?.();
      } catch (err) {
        // Si l'item existe déjà côté serveur (409 conflict), on le reflète
        // dans l'UI comme favorisé — pas une vraie erreur pour l'utilisateur.
        if (err?.status === 409 && !favored) {
          setFavored(true);
          toast.success(t('favorites.addSuccess'));
        } else {
          // Affiche le message réel renvoyé par l'API (utile pour debug).
          toast.error(err?.message ?? t('errors.generic'));
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, isAuthenticated, favored, localFavoriteId, item, itemModel, onToggle, t],
  );

  const label = favored
    ? t('word.removeFromFavorites')
    : t('word.addToFavorites');

  // Actif : fond rouge plein + cœur sable (même rouge que "Supprimer la racine").
  // Repos : fond/bordure neutres alignés sur les actions voisines (crayon, poubelle).
  // Hover : teinte sable dorée (cohérence avec les ornements de l'app).
  const stateClasses = favored
    ? 'bg-error-light text-sand-50 border-error-light dark:bg-error-dark dark:text-sand-50 dark:border-error-dark'
    : 'bg-neutral-0 text-ink border-neutral-950 hover:bg-sand-300 hover:text-accent-800 hover:border-sand-400 dark:bg-neutral-900 dark:text-neutral-0 dark:border-neutral-0 dark:hover:bg-sand-300 dark:hover:text-accent-900 dark:hover:border-sand-300';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={label}
      aria-pressed={favored}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300 disabled:pointer-events-none ${stateClasses}`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={favored ? 'filled' : 'empty'}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill={favored ? 'currentColor' : 'none'}
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
