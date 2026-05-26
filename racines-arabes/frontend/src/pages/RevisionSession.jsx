// Page de session de révision — chrono + cartes recto/verso.
// Recto : lettres arabes de la racine ; verso (au clic) : sens FR/EN/AR + 4
// boutons d'auto-évaluation (raté / difficile / moyen / facile).
// Une session se termine quand le chrono atteint 0 OU que toutes les cartes
// ont été notées. En fin de session, on affiche le score global et le détail
// par racine.
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useFetch } from '@/hooks/useFetch';
import {
  getRevisionSession,
  completeRevisionSession,
} from '@/services/revision.service';
import { joinLetters } from '@/utils/formatters';

// Durée par carte (en secondes). 30s × nb_cartes au minimum 60s.
const SECONDS_PER_CARD = 30;
const MIN_DURATION = 60;

// Pondération identique au backend — garde le score local cohérent.
const RATING_WEIGHTS = { miss: 0, hard: 1, medium: 2, easy: 3 };
const MAX_WEIGHT = 3;

// Couleurs Tailwind par rating : miss=rouge, hard=orange, medium=ambre, easy=vert.
const RATING_STYLES = {
  miss:
    'bg-error-light text-sand-50 border-error-light hover:bg-error-light/90 dark:bg-error-dark dark:border-error-dark',
  hard:
    'bg-orange-500 text-sand-50 border-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:border-orange-600',
  medium:
    'bg-amber-500 !text-white border-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:border-amber-500',
  easy:
    'bg-emerald-600 text-sand-50 border-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:border-emerald-600',
};

const formatTime = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
};

// Calcule un score sur 100 à partir d'une liste de ratings.
const computeScore = (ratings) => {
  if (!ratings || ratings.length === 0) return null;
  const total = ratings.length;
  const weighted = ratings.reduce(
    (sum, r) => sum + (RATING_WEIGHTS[r] ?? 0),
    0,
  );
  return Math.round((weighted / (total * MAX_WEIGHT)) * 100);
};

const RevisionSession = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cards, loading, error } = useFetch(() => getRevisionSession(), []);

  // ── État de session ─────────────────────────────────────────────────────
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  // Map id → rating accumulés pendant la session.
  const [ratings, setRatings] = useState({});

  // Durée totale calculée une seule fois (pas à chaque rerender).
  const totalDuration = useMemo(() => {
    const n = Array.isArray(cards) ? cards.length : 0;
    return Math.max(MIN_DURATION, n * SECONDS_PER_CARD);
  }, [cards]);

  const [secondsLeft, setSecondsLeft] = useState(totalDuration);
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);
  // Snapshot des ratings réellement envoyés (utile pour l'affichage post-session
  // même si la map est ensuite réinitialisée).
  const [sessionResult, setSessionResult] = useState(null);

  // Resync la durée quand les cartes arrivent.
  useEffect(() => {
    setSecondsLeft(totalDuration);
  }, [totalDuration]);

  // ── Persistance côté serveur (une seule fois par session) ───────────────
  // On utilise une ref pour lire l'état des ratings AU MOMENT de l'envoi,
  // sans recréer la callback à chaque keystroke (évite les loops d'effet).
  const ratingsRef = useRef(ratings);
  useEffect(() => {
    ratingsRef.current = ratings;
  }, [ratings]);

  const persistCompletion = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    const allCards = cards ?? [];
    const currentRatings = ratingsRef.current;
    const items = allCards
      .filter((c) => currentRatings[c._id])
      .map((c) => ({ id: c._id, rating: currentRatings[c._id] }));

    // Snapshot pour l'écran de fin (ratings + carte associée).
    setSessionResult({
      items,
      cardsById: Object.fromEntries(allCards.map((c) => [c._id, c])),
    });

    if (items.length === 0) return;
    try {
      await completeRevisionSession(items);
    } catch (err) {
      // Non bloquant — la session est terminée côté UI quoi qu'il arrive.
      toast.error(err?.message ?? t('errors.generic'));
    }
  }, [cards, t]);

  const endSession = useCallback(() => {
    setFinished(true);
    persistCompletion();
  }, [persistCompletion]);

  // ── Chrono ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started || finished) return undefined;
    if (secondsLeft <= 0) {
      endSession();
      return undefined;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished, secondsLeft, endSession]);

  const handleStart = () => {
    setStarted(true);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setRatings({});
    setSessionResult(null);
    completedRef.current = false;
    setSecondsLeft(totalDuration);
  };

  const handleFlip = () => setFlipped((f) => !f);

  // Sélection d'un rating : enregistre puis avance à la carte suivante (ou termine).
  const handleRate = useCallback(
    (rating) => {
      const total = cards?.length ?? 0;
      const currentCard = cards?.[index];
      if (!currentCard) return;

      const nextRatings = { ...ratingsRef.current, [currentCard._id]: rating };
      ratingsRef.current = nextRatings;
      setRatings(nextRatings);

      if (index + 1 >= total) {
        endSession();
        return;
      }
      setIndex((i) => i + 1);
      setFlipped(false);
    },
    [cards, index, endSession],
  );

  // ── Vues ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <EmptyState
          tone="error"
          eyebrow={t('common.error')}
          title={error?.message ?? t('errors.generic')}
        />
      </PageWrapper>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <PageWrapper title={t('revisions.sessionTitle')} eyebrow={t('revisions.eyebrow')}>
        <EmptyState
          eyebrow={t('revisions.emptyEyebrow')}
          title={t('revisions.empty')}
          action={
            <Button as={Link} to="/explorer" variant="primary">
              {t('nav.explorer')}
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  // Écran d'accueil avant lancement.
  if (!started) {
    return (
      <PageWrapper title={t('revisions.sessionTitle')} eyebrow={t('revisions.eyebrow')}>
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-10 sm:p-14 text-center">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — {t('revisions.ready')}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('revisions.readyTitle')}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm text-neutral-700 dark:text-neutral-300">
            {t('revisions.readyText', {
              count: cards.length,
              duration: formatTime(totalDuration),
            })}
          </p>
          <div className="mt-8 grid grid-cols-2 max-w-md mx-auto divide-x divide-accent-700/40 dark:divide-accent-300/30 border border-accent-700/40 dark:border-accent-300/30">
            <div className="px-4 py-5">
              <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {t('revisions.cards')}
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-accent-700 dark:text-accent-300">
                {String(cards.length).padStart(2, '0')}
              </p>
            </div>
            <div className="px-4 py-5">
              <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {t('revisions.duration')}
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-accent-700 dark:text-accent-300">
                {formatTime(totalDuration)}
              </p>
            </div>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart} className="mt-8">
            {t('revisions.startSession')} →
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Écran de fin — récap des ratings + score de la session.
  if (finished) {
    const result = sessionResult ?? { items: [], cardsById: {} };
    const ratingsList = result.items.map((it) => it.rating);
    const sessionScore = computeScore(ratingsList);
    const counts = ratingsList.reduce(
      (acc, r) => {
        acc[r] = (acc[r] ?? 0) + 1;
        return acc;
      },
      { miss: 0, hard: 0, medium: 0, easy: 0 },
    );

    return (
      <PageWrapper title={t('revisions.sessionTitle')} eyebrow={t('revisions.eyebrow')}>
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-10 sm:p-14">
          <div className="text-center">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — {t('revisions.done')}
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
              {t('revisions.doneTitle')}
            </h2>
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
              {t('revisions.doneText', { count: result.items.length })}
            </p>
          </div>

          {/* Score global de la session */}
          {sessionScore !== null && (
            <div className="mt-10 flex flex-col items-center">
              <p className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                {t('revisions.sessionScore')}
              </p>
              <p className="mt-2 font-mono text-6xl font-extrabold tabular-nums text-accent-700 dark:text-accent-300">
                {sessionScore}
                <span className="text-2xl text-neutral-400 dark:text-neutral-500">/100</span>
              </p>
            </div>
          )}

          {/* Répartition par rating */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['miss', 'hard', 'medium', 'easy'].map((key) => (
              <div
                key={key}
                className="border border-accent-700/40 dark:border-accent-300/30 px-4 py-5 text-center"
              >
                <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {t(`revisions.rating.${key}`)}
                </p>
                <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ink dark:text-neutral-0">
                  {String(counts[key]).padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>

          {/* Détail par racine */}
          {result.items.length > 0 && (
            <div className="mt-10">
              <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                — {t('revisions.detailByRoot')}
              </p>
              <div className="mt-4 border border-accent-700/40 dark:border-accent-300/30 divide-y divide-neutral-200 dark:divide-neutral-800">
                {result.items.map((it) => {
                  const card = result.cardsById[it.id];
                  const root = card?.root ?? {};
                  const letters =
                    root.letters ?? (root.slug ? root.slug.split('-') : []);
                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          lang="ar"
                          dir="rtl"
                          className="font-arabic text-2xl font-bold text-ink dark:text-neutral-0 shrink-0"
                        >
                          {joinLetters(letters)}
                        </span>
                        <span className="truncate text-sm text-neutral-700 dark:text-neutral-300">
                          {root.meaningFr || '—'}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-2xs font-bold uppercase tracking-[0.18em] px-3 py-1 border ${RATING_STYLES[it.rating]}`}
                      >
                        {t(`revisions.rating.${it.rating}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="md" onClick={handleStart}>
              {t('revisions.again')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/revisions')}
            >
              {t('revisions.backToList')}
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ── Session en cours ────────────────────────────────────────────────────
  const card = cards[index];
  const r = card.root ?? {};
  const letters = r.letters ?? (r.slug ? r.slug.split('-') : []);
  const progressPct = ((index + 1) / cards.length) * 100;

  return (
    <PageWrapper title={t('revisions.sessionTitle')} eyebrow={t('revisions.eyebrow')}>
      {/* Barre supérieure : chrono + progression + abandon */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {t('revisions.timer')}
            </span>
            <span
              className={`font-mono text-2xl font-bold tabular-nums ${
                secondsLeft <= 10
                  ? 'text-error-light dark:text-error-dark'
                  : 'text-accent-700 dark:text-accent-300'
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          </div>
          <span className="h-10 w-px bg-neutral-300 dark:bg-neutral-700" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {t('revisions.progress')}
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums text-ink dark:text-neutral-0">
              {String(index + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={endSession}>
          {t('revisions.endSession')}
        </Button>
      </div>

      <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-accent-700 dark:bg-accent-300"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Carte — au recto on clique pour retourner ; au verso les boutons rating
          gèrent la transition vers la carte suivante. */}
      <div
        className="select-none"
        style={{ perspective: '1500px' }}
        onClick={!flipped ? handleFlip : undefined}
        onKeyDown={(e) => {
          if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            handleFlip();
          }
        }}
        role={!flipped ? 'button' : undefined}
        tabIndex={!flipped ? 0 : undefined}
        aria-label={!flipped ? t('revisions.showBack') : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${flipped ? 'back' : 'front'}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 min-h-[50vh] flex flex-col items-center justify-center p-10 ${
              !flipped ? 'cursor-pointer' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!flipped ? (
              // Recto : la racine
              <>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                  — {t('revisions.front')}
                </p>
                <p
                  lang="ar"
                  dir="rtl"
                  className="mt-6 font-arabic text-[5rem] sm:text-[7rem] font-bold leading-[0.9] text-ink dark:text-neutral-0"
                >
                  {joinLetters(letters)}
                </p>
                {r.transliteration && (
                  <p className="mt-3 text-sm italic text-neutral-500 dark:text-neutral-400">
                    / {r.transliteration} /
                  </p>
                )}
                <p className="mt-10 text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {t('revisions.clickToReveal')}
                </p>
              </>
            ) : (
              // Verso : la traduction
              <>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
                  — {t('revisions.back')}
                </p>
                <p className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0 text-center">
                  {r.meaningFr || '—'}
                </p>
                {r.meaningEn && (
                  <p className="mt-3 text-base text-neutral-600 dark:text-neutral-300 italic">
                    {r.meaningEn}
                  </p>
                )}
                {r.meaningAr && (
                  <p
                    lang="ar"
                    dir="rtl"
                    className="mt-4 font-arabic text-2xl text-neutral-700 dark:text-neutral-300"
                  >
                    {r.meaningAr}
                  </p>
                )}
                <p className="mt-8 text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  {t('revisions.howDidItGo')}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions — au recto : bouton "voir le verso" ; au verso : 4 ratings.
          On stoppe la propagation pour ne pas re-flipper la carte. */}
      {!flipped ? (
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
          >
            {t('revisions.showBack')} →
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['miss', 'hard', 'medium', 'easy'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRate(key);
              }}
              className={`h-12 border text-2xs font-bold uppercase tracking-[0.2em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${RATING_STYLES[key]}`}
            >
              {t(`revisions.rating.${key}`)}
            </button>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default RevisionSession;
