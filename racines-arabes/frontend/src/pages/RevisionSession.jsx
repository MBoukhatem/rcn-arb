// Page de session de révision — chrono + cartes recto/verso.
// Recto : lettres arabes de la racine ; verso (au clic) : sens FR/EN/AR.
// Une session se termine quand le chrono atteint 0 OU que toutes les cartes
// ont été parcourues.
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

const formatTime = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const RevisionSession = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: cards, loading, error } = useFetch(() => getRevisionSession(), []);

  // ── État de session ─────────────────────────────────────────────────────
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  // Durée totale calculée une seule fois (pas à chaque rerender).
  const totalDuration = useMemo(() => {
    const n = Array.isArray(cards) ? cards.length : 0;
    return Math.max(MIN_DURATION, n * SECONDS_PER_CARD);
  }, [cards]);

  const [secondsLeft, setSecondsLeft] = useState(totalDuration);
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);

  // Resync la durée quand les cartes arrivent.
  useEffect(() => {
    setSecondsLeft(totalDuration);
  }, [totalDuration]);

  // ── Persistance côté serveur (une seule fois par session) ───────────────
  const persistCompletion = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    const ids = (cards ?? []).map((c) => c._id);
    if (ids.length === 0) return;
    try {
      await completeRevisionSession(ids);
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
    completedRef.current = false;
    setSecondsLeft(totalDuration);
  };

  const handleFlip = () => setFlipped((f) => !f);

  const handleNext = useCallback(() => {
    const total = cards?.length ?? 0;
    if (index + 1 >= total) {
      endSession();
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
  }, [cards, index, endSession]);

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

  // Écran de fin.
  if (finished) {
    return (
      <PageWrapper title={t('revisions.sessionTitle')} eyebrow={t('revisions.eyebrow')}>
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 p-10 sm:p-14 text-center">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — {t('revisions.done')}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('revisions.doneTitle')}
          </h2>
          <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
            {t('revisions.doneText', { count: cards.length })}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      {/* Carte */}
      <div
        className="select-none"
        style={{ perspective: '1500px' }}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={flipped ? t('revisions.showFront') : t('revisions.showBack')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${flipped ? 'back' : 'front'}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 min-h-[50vh] flex flex-col items-center justify-center p-10 cursor-pointer"
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
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
        >
          {flipped ? t('revisions.showFront') : t('revisions.showBack')}
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          {index + 1 >= cards.length
            ? t('revisions.finish')
            : `${t('revisions.next')} →`}
        </Button>
      </div>
    </PageWrapper>
  );
};

export default RevisionSession;
