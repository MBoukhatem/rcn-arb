// Normalisation du texte arabe et génération de slug (cf. PROJET.md §7.3)

// Tashkīl : diacritiques arabes (U+0610–U+061A, U+064B–U+065F, U+0670, U+06D6–U+06ED)
const TASHKIL = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;

// Tatweel : caractère d'allongement ـ (U+0640)
const TATWEEL = /ـ/g;

// Plage arabe de base (lettres) — U+0621–U+064A
const ARABIC_LETTER = /^[ء-ي]$/;

/**
 * Normalise une chaîne arabe :
 * - supprime le tashkīl (diacritiques)
 * - supprime le tatweel
 * - unifie les hamzas/alifs (أ إ آ ٱ → ا) et ى → ي
 * - applique trim()
 * @param {string} input
 * @returns {string}
 */
export const normalizeArabic = (input = '') =>
  String(input)
    .replace(TASHKIL, '')
    .replace(TATWEEL, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();

/**
 * Construit le slug d'une racine : 3 lettres normalisées jointes par '-'.
 * @param {string[]} letters
 * @returns {string} ex. 'ك-ت-ب'
 */
export const buildSlug = (letters = []) => letters.map(normalizeArabic).join('-');

/**
 * Vérifie qu'une valeur est exactement une lettre arabe de base.
 * @param {string} ch
 * @returns {boolean}
 */
export const isSingleArabicLetter = (ch) =>
  typeof ch === 'string' && ch.length === 1 && ARABIC_LETTER.test(ch);
