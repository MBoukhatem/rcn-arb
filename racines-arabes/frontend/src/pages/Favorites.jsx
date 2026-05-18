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

  const handleToggle = useCallback(() => {
    toast.success(t('favorites.removeSuccess'));
    refetch();
  }, [refetch, t]);

  const favorites = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const roots = favorites.filter((f) => f?.itemModel === 'Root');
  const words = favorites.filter((f) => f?.itemModel === 'Word');

  return (
    <PageWrapper title={t('favorites.title')} eyebrow="Bibliothèque · Personnelle">
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && error && (
        <div className="border-2 border-accent-500 dark:border-accent-300 py-12 text-center">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            {error?.message ?? t('errors.generic')}
          </p>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="border-2 border-dashed border-neutral-950 dark:border-neutral-0 py-20 text-center">
          <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
            — Aucun favori
          </p>
          <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
            {t('favorites.empty')}
          </p>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="space-y-16">
          {roots.length > 0 && (
            <section>
              <header className="flex items-end justify-between gap-4 border-b-2 border-neutral-950 dark:border-neutral-0 pb-4 mb-8">
                <div>
                  <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                    — 01 / Racines
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
                    {t('favorites.roots')}
                  </h2>
                </div>
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {String(roots.length).padStart(2, '0')} entr.
                </span>
              </header>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-neutral-950 dark:border-neutral-0"
              >
                {roots.map((fav) => (
                  <motion.div
                    key={fav._id}
                    variants={cardVariants}
                    className="relative -ml-px -mt-px"
                  >
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
              <header className="flex items-end justify-between gap-4 border-b-2 border-neutral-950 dark:border-neutral-0 pb-4 mb-8">
                <div>
                  <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                    — 02 / Mots
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-0">
                    {t('favorites.words')}
                  </h2>
                </div>
                <span className="font-mono text-2xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {String(words.length).padStart(2, '0')} entr.
                </span>
              </header>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-neutral-950 dark:border-neutral-0"
              >
                {words.map((fav) => (
                  <motion.div
                    key={fav._id}
                    variants={cardVariants}
                    className="-ml-px -mt-px"
                  >
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
