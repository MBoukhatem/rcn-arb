// LetterPicker — grille graphique des 28 lettres arabes, sans border-radius.
import { useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import alphabet from '@/assets/arabic-alphabet.json';

// Style des cellules de l'alphabet. La taille du texte suit la taille de la
// cellule via `1em` du fontSize parent (défini en clamp dans le JSX).
const CELL_BASE =
  'aspect-square flex items-center justify-center font-arabic ' +
  'font-semibold cursor-pointer transition-all duration-150 ease-snappy ' +
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

// Lettre qui peut compléter une racine existante avec la sélection actuelle.
// Rouge vif + bordure pour bien ressortir de la grille au repos.
const CELL_SUGGESTED =
  'bg-error-light/15 text-error-light border border-error-light ' +
  'hover:bg-error-light hover:text-sand-50 ' +
  'dark:bg-error-dark/20 dark:text-error-dark dark:border-error-dark ' +
  'dark:hover:bg-error-dark dark:hover:text-sand-50';

const CELL_DISABLED = 'opacity-30 pointer-events-none';

// Slots des 3 lettres sélectionnées. Dimensions fluides via clamp() inline.
const SLOT_BASE =
  'flex items-center justify-center font-arabic font-bold ' +
  'transition-all duration-150 relative';

const SLOT_EMPTY =
  'text-neutral-300 dark:text-neutral-700 bg-neutral-0 dark:bg-neutral-850';
const SLOT_FILLED =
  'bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950';
const SLOT_ACTIVE =
  'ring-2 ring-offset-2 ring-accent-500 dark:ring-accent-300 ring-offset-neutral-0 dark:ring-offset-neutral-900';

const LetterPicker = ({ value = ['', '', ''], onChange, suggestions = {} }) => {
  const { t } = useTranslation();
  const shouldReduce = useReducedMotion();

  const [activeSlot, setActiveSlot] = useState(0);

  const letters = useMemo(
    () => [value[0] ?? '', value[1] ?? '', value[2] ?? ''],
    [value],
  );

  // Union des lettres suggérées pour le slot actif. Si le slot actif est déjà
  // rempli (ou n'a pas de suggestions), on ne propose rien — on évite ainsi
  // d'éclairer des lettres qui ne mèneraient à aucune racine pour ce slot.
  const suggestedSet = useMemo(() => {
    const slotSuggestions = suggestions?.[activeSlot];
    if (slotSuggestions instanceof Set) return slotSuggestions;
    if (Array.isArray(slotSuggestions)) return new Set(slotSuggestions);
    return new Set();
  }, [suggestions, activeSlot]);

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

  // Dimensions fluides via clamp() pour que toute la card (header + 3 slots
  // + alphabet 28 lettres en 4 lignes) tienne dans une fenêtre 1080p sans
  // scroll, tout en restant lisible.
  //   – Slots des 3 lettres : entre 3rem (48px) et 4.5rem (72px)
  //   – Texte du slot       : entre 1.25rem (20px) et 2rem (32px)
  //   – Cellules alphabet   : taille du texte fluide entre 0.875rem et 1.25rem
  //     (chaque cellule a aspect-square donc sa hauteur suit son fontSize)
  const slotSize = 'clamp(3rem, 5vw, 4.5rem)';
  const slotFontSize = 'clamp(1.25rem, 2.5vw, 2rem)';
  const alphabetFontSize = 'clamp(0.875rem, 1.5vw, 1.25rem)';

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 'clamp(0.625rem, 1.4vw, 1rem)' }}
    >
      {/* Header info */}
      <div className="flex w-full items-center justify-between">
        <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
          — {t('explorer.letterSelection')}
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

      {/* Emplacements des 3 lettres sélectionnées */}
      <div
        dir="rtl"
        className="flex items-center justify-center"
        style={{ gap: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}
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
            style={{
              width: slotSize,
              height: slotSize,
              fontSize: slotFontSize,
            }}
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

      {/* Grille des 28 lettres arabes — beaucoup de colonnes pour limiter la
          hauteur (2 lignes sur desktop = 14 colonnes ; sur mobile on en met
          moins). Les cellules conservent `aspect-square` donc plus elles sont
          étroites en largeur, moins elles prennent de hauteur. */}
      <div className="w-full">
        <p className="mb-2 text-2xs font-bold uppercase tracking-[0.24em] text-ink dark:text-neutral-0">
          — {t('explorer.alphabet')}
        </p>
        <div
          dir="rtl"
          className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-14 gap-0"
          role="group"
          aria-label={t('explorer.pickLetters')}
          style={{ fontSize: alphabetFontSize }}
        >
          {alphabet.map(({ char, name }) => {
            const isSelected = letters.includes(char);
            const isDisabled = allFilled && !isSelected;
            const isSuggested = !isSelected && suggestedSet.has(char);

            // Priorité : sélectionnée > suggérée > état neutre.
            let cellState = CELL_REST;
            if (isSelected) cellState = CELL_SELECTED;
            else if (isSuggested) cellState = CELL_SUGGESTED;

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
                className={`${CELL_BASE} -ml-px -mt-px ${cellState} ${
                  isDisabled ? CELL_DISABLED : ''
                }`}
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
