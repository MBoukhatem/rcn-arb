// Connaissance morphologique côté frontend : les 7 types dérivés et leurs métadonnées.

// Codes des 7 types, dans l'ordre d'affichage souhaité.
export const WORD_TYPES = [
  'VERB',
  'MASDAR',
  'ACTIVE_PART',
  'PASSIVE_PART',
  'NOUN_PLACE',
  'NOUN_TOOL',
  'ELATIVE',
];

// Temps verbaux (pertinents uniquement pour le type VERB).
export const VERB_TENSES = ['MADI', 'MUDARI', 'AMR'];

// Métadonnées par type : ordre, clé i18n, nom arabe diacrité, accent du badge.
export const TYPE_META = {
  VERB: {
    order: 0,
    i18nKey: 'morphology.VERB',
    arabicName: 'الفِعْل',
    badgeAccent: true,
  },
  MASDAR: {
    order: 1,
    i18nKey: 'morphology.MASDAR',
    arabicName: 'المَصْدَر',
    badgeAccent: false,
  },
  ACTIVE_PART: {
    order: 2,
    i18nKey: 'morphology.ACTIVE_PART',
    arabicName: 'اسم الفَاعِل',
    badgeAccent: false,
  },
  PASSIVE_PART: {
    order: 3,
    i18nKey: 'morphology.PASSIVE_PART',
    arabicName: 'اسم المَفْعُول',
    badgeAccent: false,
  },
  NOUN_PLACE: {
    order: 4,
    i18nKey: 'morphology.NOUN_PLACE',
    arabicName: 'اسم المَكَان',
    badgeAccent: false,
  },
  NOUN_TOOL: {
    order: 5,
    i18nKey: 'morphology.NOUN_TOOL',
    arabicName: 'اسم الآلَة',
    badgeAccent: false,
  },
  ELATIVE: {
    order: 6,
    i18nKey: 'morphology.ELATIVE',
    arabicName: 'اسم التَّفْضِيل',
    badgeAccent: true,
  },
};

// Libellé traduit d'un type via la fonction `t` de i18next.
export const getTypeLabel = (code, t) => {
  const meta = TYPE_META[code];
  if (!meta) return code;
  return typeof t === 'function' ? t(meta.i18nKey) : meta.i18nKey;
};

// Regroupe un tableau de mots par `type`, en respectant l'ordre de WORD_TYPES.
export const groupWordsByType = (words = []) =>
  WORD_TYPES.map((type) => ({
    type,
    meta: TYPE_META[type],
    words: words.filter((w) => w?.type === type),
  })).filter((group) => group.words.length > 0);
