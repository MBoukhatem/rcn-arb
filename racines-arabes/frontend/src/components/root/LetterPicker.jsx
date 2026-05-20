// LetterPicker — grille graphique des 28 lettres arabes, sans border-radius.
import { useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import alphabet from '@/assets/arabic-alphabet.json';

const CELL_BASE =
  'aspect-square flex items-center justify-center font-arabic ' +
  'text-2xl sm:text-3xl font-semibold cursor-pointer transition-all duration-150 ease-snappy ' +
  'select-none focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent-500 dark:focus-visible:ring-accent-300';

const CELL_REST =
  'bg-neutral-0 text-ink ' +
  'hover:bg-neutral-950 hover:text-neutral-0 ' +
  'dark:bg-neutral-850 dark:text-neutral-0 ' +
  'dark:hover:bg-neutral-0 dark:hover:text-neutral-950';

const CELL_SELECTED =
  'bg-accent-500 text-neutral-0 ' +
  'dark:bg-accent-300 dark:text-neutral-950';

const CELL_DISABLED = 'opacity-30 pointer-events-none';

const SLOT_BASE =
  'h-24 w-24 sm:h-28 sm:w-28 flex items-center justify-center ' +
  'font-arabic text-4xl sm:text-5xl font-bold transition-all duration-150 relative';

const SLOT_EMPTY =
  'text-neutral-300 dark:text-neutral-700 bg-neutral-0 dark:bg-neutral-850';
const SLOT_FILLED =
  'bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950';
const SLOT_ACTIVE =
  'ring-2 ring-offset-2 ring-accent-500 dark:ring-accent-300 ring-offset-neutral-0 dark:ring-offset-neutral-900';

const LetterPicker = ({ value = ['', '', ''], onChange }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();

  const [activeSlot, setActiveSlot] = useState(0);

  const letters = useMemo(
    () => [value[0] ?? '', value[1] ?? '', value[2] ?? ''],
    [value],
  );

  const pickLetter = useCallback(
    (char) => {
      const next = [...letters];
      next[activeSlot] = char;
      onChange?.(next);
      const emptyIndex = next.findIndex((l) => !l);
      setActiveSlot(emptyIndex === -1 ? activeSlot : emptyIndex);
    },
    [letters, activeSlot, onChange],
  );

  const clearSlot = useCallback(
    (index) => {
      const next = [...letters];
      next[index] = '';
      onChange?.(next);
      setActiveSlot(index);
    },
    [letters, onChange],
  );

  const reset = useCallback(() => {
    onChange?.(['', '', '']);
    setActiveSlot(0);
  }, [onChange]);

  const hasAny = letters.some((l) => l);
  const allFilled = letters.every((l) => l);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Header info */}
      <div className="flex w-full items-center justify-between">
        <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
          — Sélection / 3 lettres
        </p>
        <button
          type="button"
          onClick={reset}
          disabled={!hasAny}
          className="text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-700 dark:text-neutral-300 hover:text-accent-500 dark:hover:text-accent-300 disabled:opacity-30 transition-colors"
        >
          {t('common.cancel')} ×
        </button>
      </div>

      {/* Emplacements */}
      <div
        dir="rtl"
        className="flex items-center justify-center gap-3 sm:gap-5"
        role="group"
        aria-label={t('root.letters')}
      >
        {letters.map((letter, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => (letter ? clearSlot(index) : setActiveSlot(index))}
            aria-label={`${t('explorer.pickLetters')} — ${index + 1}`}
            className={`${SLOT_BASE} ${letter ? SLOT_FILLED : SLOT_EMPTY} ${
              activeSlot === index ? SLOT_ACTIVE : ''
            } focus-visible:outline-none`}
            animate={
              letter && !shouldReduce ? { scale: [0.85, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              aria-hidden="true"
              className="absolute top-1 left-1 font-mono text-[10px] font-semibold tracking-widest opacity-50"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            {letter || '·'}
          </motion.button>
        ))}
      </div>

      {/* Grille des 28 lettres arabes */}
      <div className="w-full max-w-2xl">
        <p className="mb-3 text-2xs font-bold uppercase tracking-[0.24em] text-ink dark:text-neutral-0">
          — Alphabet · 28
        </p>
        <div
          dir="rtl"
          className="grid grid-cols-6 sm:grid-cols-7 gap-0"
          role="group"
          aria-label={t('explorer.pickLetters')}
        >
          {alphabet.map(({ char, name }) => {
            const isSelected = letters.includes(char);
            const isDisabled = allFilled && !isSelected;

            return (
              <motion.button
                key={char}
                type="button"
                lang="ar"
                onClick={() => pickLetter(char)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-label={name}
                whileTap={shouldReduce || isDisabled ? undefined : { scale: 0.92 }}
                className={`${CELL_BASE} -ml-px -mt-px ${
                  isSelected ? CELL_SELECTED : CELL_REST
                } ${isDisabled ? CELL_DISABLED : ''}`}
              >
                {char}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LetterPicker;
