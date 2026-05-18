// Petites fonctions utilitaires de formatage.

// Date ISO → date lisible localisée (ex. '18 mai 2026').
export const formatDate = (iso, locale = 'fr') => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Tronque une chaîne à `n` caractères avec une ellipse.
export const truncate = (str, n) => {
  if (!str || str.length <= n) return str ?? '';
  return `${str.slice(0, n).trimEnd()}…`;
};

// Met la première lettre en majuscule.
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Joint les lettres d'une racine par des espaces (ex. 'ك ت ب').
export const joinLetters = (lettersArray = []) => lettersArray.join(' ');

// Construit un slug à partir des lettres (ex. 'ك-ت-ب').
export const slugFromLetters = (lettersArray = []) => lettersArray.join('-');
