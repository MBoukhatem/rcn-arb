// Page favoris — protégée. Racines et mots favoris de l'utilisateur.
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import RootCard from '@/components/root/RootCard';
import WordCard from '@/components/word/WordCard';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useFetch } from '@/hooks/useFetch';
import { getFavorites } from '@/services/favorite.service';

const listVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

const Favorites = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getFavorites({ page, limit: 12 }),
    [page],
  );

  // Après retrait d'un favori : on rafraîchit la liste.
  const handleToggle = useCallback(() => {
    toast.success(t('favorites.removeSuccess'));
    refetch();
  }, [refetch, t]);

  const favorites = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const roots = favorites.filter((f) => f?.itemModel === 'Root');
  const words = favorites.filter((f) => f?.itemModel === 'Word');

  return (
    <PageWrapper title={t('favorites.title')}>
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && error && (
        <p className="py-16 text-center text-base text-error-light dark:text-error-dark">
          {error?.message ?? t('errors.generic')}
        </p>
      )}

      {!loading && !error && favorites.length === 0 && (
        <p className="py-16 text-center text-base text-neutral-500 dark:text-neutral-400">
          {t('favorites.empty')}
        </p>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="space-y-12">
          {roots.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                {t('favorites.roots')}
              </h2>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
              >
                {roots.map((fav) => (
                  <motion.div key={fav._id} variants={cardVariants} className="relative">
                    <RootCard root={fav.item} />
                    <div className="absolute right-3 top-3">
                      <FavoriteButton
                        item={fav.item?._id}
                        itemModel="Root"
                        isFavorited
                        favoriteId={fav._id}
                        onToggle={handleToggle}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {words.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                {t('favorites.words')}
              </h2>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
              >
                {words.map((fav) => (
                  <motion.div key={fav._id} variants={cardVariants}>
                    <WordCard
                      word={fav.item}
                      actions={
                        <FavoriteButton
                          item={fav.item?._id}
                          itemModel="Word"
                          isFavorited
                          favoriteId={fav._id}
                          onToggle={handleToggle}
                        />
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default Favorites;
