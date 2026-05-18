// Enums partagés du domaine — source unique de vérité (cf. PROJET.md §6, §7)

// Les 7 types morphologiques dérivés (Décision D7)
export const WORD_TYPES = [
  'VERB',
  'MASDAR',
  'ACTIVE_PART',
  'PASSIVE_PART',
  'NOUN_PLACE',
  'NOUN_TOOL',
  'ELATIVE',
];

// Temps verbaux — pertinents uniquement si type === 'VERB'
export const VERB_TENSES = ['MADI', 'MUDARI', 'AMR'];

// Rôles utilisateur
export const USER_ROLES = ['user', 'admin'];

// Langue maternelle du profil utilisateur (Décision D5)
export const NATIVE_LANGUAGES = ['fr', 'en', 'ar'];

// Modèles cibles d'un favori (refPath itemModel)
export const FAVORITE_ITEM_MODELS = ['Root', 'Word'];
