// LetterPicker — sélection interactive des 3 lettres d'une racine.
// Design System §5.10. Cœur de l'outil d'exploration.
import { useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import alphabet from '@/assets/arabic-alphabet.json';
import Button from '@/components/ui/Button';

// Cellule de la grille des 28 lettres.
const CELL_BASE =
  'aspect-square flex items-center justify-center rounded-lg font-arabic ' +
  'text-ar-lg font-semibold cursor-pointer transition-all duration-150 ease-snappy ' +
  'select-none focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent-600 dark:focus-visible:ring-accent-400';

const CELL_REST =
  'bg-neutral-0 text-neutral-800 border border-neutral-200 ' +
  'hover:border-accent-300 hover:text-accent-700 hover:-translate-y-0.5 ' +
  'dark:bg-neutral-850 dark:text-neutral-200 dark:border-neutral-700 ' +
  'dark:hover:border-accent-400/60 dark:hover:text-accent-300';

const CELL_SELECTED =
  'bg-accent-600 text-neutral-0 border border-transparent shadow-accent-glow';

const CELL_DISABLED = 'opacity-40 pointer-events-none';

const SLOT_BASE =
  'h-20 w-20 rounded-xl border-2 flex items-center justify-center ' +
  'font-arabic text-ar-lg transition-all duration-150';

const SLOT_EMPTY =
  'border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-300 dark:text-neutral-600';
const SLOT_FILLED =
  'border-solid border-accent-600 dark:border-accent-400 bg-accent-50 ' +
  'dark:bg-accent-900/30 text-accent-700 dark:text-accent-300';
const SLOT_ACTIVE = 'ring-2 ring-accent-600 dark:ring-accent-400 ring-offset-2';

/**
 * @param {object} props
 * @param {string[]} props.value - tableau de 3 chaînes (lettres, possiblement vides).
 * @param {Function} props.onChange - reçoit le nouveau tableau de 3 lettres.
 */
const LetterPicker = ({ value = ['', '', ''], onChange }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();

  // Emplacement actif : celui qui recevra la prochaine lettre choisie.
  const [activeSlot, setActiveSlot] = useState(0);

  // Normalise `value` en exactement 3 cases.
  const letters = useMemo(
    () => [value[0] ?? '', value[1] ?? '', value[2] ?? ''],
    [value],
  );

  // Pose une lettre dans l'emplacement actif puis avance le curseur.
  const pickLetter = useCallback(
    (char) => {
      const next = [...letters];
      next[activeSlot] = char;
      onChange?.(next);
      // Avance vers le premier emplacement encore vide.
      const emptyIndex = next.findIndex((l) => !l);
      setActiveSlot(emptyIndex === -1 ? activeSlot : emptyIndex);
    },
    [letters, activeSlot, onChange],
  );

  // Vide un emplacement et le rend actif.
  const clearSlot = useCallback(
    (index) => {
      const next = [...letters];
      next[index] = '';
      onChange?.(next);
      setActiveSlot(index);
    },
    [letters, onChange],
  );

  // Réinitialise les 3 lettres.
  const reset = useCallback(() => {
    onChange?.(['', '', '']);
    setActiveSlot(0);
  }, [onChange]);

  const hasAny = letters.some((l) => l);
  const allFilled = letters.every((l) => l);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Zone des 3 emplacements choisis — RTL pour l'ordre de lecture arabe */}
      <div
        dir="rtl"
        className="flex items-center justify-center gap-4"
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
              letter && !shouldReduce
                ? { scale: [0.85, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {letter || '·'}
          </motion.button>
        ))}
      </div>

      {/* Bouton de réinitialisation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={reset}
        disabled={!hasAny}
        aria-label={t('explorer.resetFilters')}
      >
        {t('common.cancel')}
      </Button>

      {/* Grille des 28 lettres arabes */}
      <div
        dir="rtl"
        className="grid grid-cols-6 sm:grid-cols-7 gap-2 sm:gap-2.5 w-full max-w-xl"
        role="group"
        aria-label={t('explorer.pickLetters')}
      >
        {alphabet.map(({ char, name }) => {
          const isSelected = letters.includes(char);
          // Désactive si les 3 lettres sont prises et que la lettre n'en fait pas partie.
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
              whileTap={shouldReduce || isDisabled ? undefined : { scale: 0.94 }}
              className={`${CELL_BASE} ${
                isSelected ? CELL_SELECTED : CELL_REST
              } ${isDisabled ? CELL_DISABLED : ''}`}
            >
              {char}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LetterPicker;
