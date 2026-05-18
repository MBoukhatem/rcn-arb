// Données de seed — racines trilitères réelles (cf. PROJET.md §14)
// Le slug est régénéré par le hook pre('validate') du modèle Root à l'insertion.

export const rootsData = [
  {
    letters: ['ك', 'ت', 'ب'],
    meaningFr: 'écrire',
    meaningEn: 'to write',
    meaningAr: 'الكتابة',
    transliteration: 'k-t-b',
  },
  {
    letters: ['د', 'ر', 'س'],
    meaningFr: 'étudier, apprendre',
    meaningEn: 'to study',
    meaningAr: 'الدراسة',
    transliteration: 'd-r-s',
  },
  {
    letters: ['ع', 'ل', 'م'],
    meaningFr: 'savoir, connaître',
    meaningEn: 'to know',
    meaningAr: 'العِلم',
    transliteration: 'ʿ-l-m',
  },
  {
    letters: ['ك', 'س', 'ر'],
    meaningFr: 'casser, briser',
    meaningEn: 'to break',
    meaningAr: 'الكَسر',
    transliteration: 'k-s-r',
  },
  {
    letters: ['ف', 'ت', 'ح'],
    meaningFr: 'ouvrir',
    meaningEn: 'to open',
    meaningAr: 'الفَتح',
    transliteration: 'f-t-ḥ',
  },
  {
    letters: ['ج', 'م', 'ل'],
    meaningFr: 'être beau',
    meaningEn: 'to be beautiful',
    meaningAr: 'الجَمال',
    transliteration: 'j-m-l',
  },
];

export default rootsData;
