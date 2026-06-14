// Générateur de mots dérivés à partir d'une racine trilitère.
// Pour chaque racine on produit 8 entrées correspondant aux 7 types WORD_TYPES
// (avec 3 conjugaisons pour le VERB : MADI / MUDARI / AMR).
//
// Approche pragmatique : on applique les schèmes classiques sans gérer
// finement les verbes irréguliers (creux, défectueux, hamzés). Les formes
// produites sont morphologiquement plausibles dans la grande majorité des
// cas — suffisant pour peupler une base de démo.
//
// Les voyelles `vowelMadi` (a/i/u) et `vowelMudari` (a/i/u) de chaque racine
// fixent les patrons de conjugaison.

const FATHA = 'َ';   // a (◌َ)
const KASRA = 'ِ';   // i (◌ِ)
const DAMMA = 'ُ';   // u (◌ُ)
const SUKUN = 'ْ';   // ◌ْ
const SHADDA = 'ّ';  // ◌ّ
const ALIF = 'ا';    // ا
const ALIF_WASLA = 'ٱ'; // ٱ (utilisé pour l'impératif)
const TA_MARBUTA = 'ة'; // ة
const HAMZA_WASL = 'ا'; // ا (utilisé en préfixe d'impératif)

const vowelChar = (v) => (v === 'a' ? FATHA : v === 'i' ? KASRA : DAMMA);

// Translittération simplifiée par lettre arabe.
const TRANSLIT = {
  'ا': 'ā', 'أ': 'ʾ', 'إ': 'ʾ', 'آ': 'ā', 'ء': 'ʾ', 'ؤ': 'ʾ', 'ئ': 'ʾ',
  'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'ḥ', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh',
  'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 'ṣ', 'ض': 'ḍ',
  'ط': 'ṭ', 'ظ': 'ẓ',
  'ع': 'ʿ', 'غ': 'gh',
  'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y',
};

const translitLetter = (l) => TRANSLIT[l] ?? l;
const vowelTranslit = (v) => (v === 'a' ? 'a' : v === 'i' ? 'i' : 'u');

// ─── Schémas (chaque fonction reçoit les 3 radicales + voyelles) ──────────
// On colle les voyelles directement aux lettres pour produire la forme
// vocalisée — ordre Unicode : lettre puis diacritique.

/** فَعَلَ / فَعِلَ / فَعُلَ — verbe au passé 3ms (madi). */
const madi = (r1, r2, r3, vMadi) => {
  return `${r1}${FATHA}${r2}${vowelChar(vMadi)}${r3}${FATHA}`;
};

/** يَفْعُلُ / يَفْعِلُ / يَفْعَلُ — verbe au présent 3ms (mudari). */
const mudari = (r1, r2, r3, vMudari) => {
  return `ي${FATHA}${r1}${SUKUN}${r2}${vowelChar(vMudari)}${r3}${DAMMA}`;
};

/** اُفْعُلْ / اِفْعِلْ / اِفْعَلْ — impératif 2ms (amr). */
const amr = (r1, r2, r3, vMudari) => {
  // Préfixe : ا + damma si vMudari=u, sinon ا + kasra.
  const prefVowel = vMudari === 'u' ? DAMMA : KASRA;
  return `${ALIF}${prefVowel}${r1}${SUKUN}${r2}${vowelChar(vMudari)}${r3}${SUKUN}`;
};

/** فَعْل / فِعْل / فُعْل — masdar simple (souvent forme la plus brève). */
const masdar = (r1, r2, r3) => {
  return `${r1}${FATHA}${r2}${SUKUN}${r3}`;
};

/** فَاعِل — participe actif. */
const activePart = (r1, r2, r3) => {
  return `${r1}${FATHA}${ALIF}${r2}${KASRA}${r3}`;
};

/** مَفْعُول — participe passif. */
const passivePart = (r1, r2, r3) => {
  return `م${FATHA}${r1}${SUKUN}${r2}${DAMMA}و${r3}`;
};

/** مَفْعَل / مَفْعِل — nom de lieu. */
const nounPlace = (r1, r2, r3, vMudari) => {
  // Si la 2e voyelle au mudari est i, on prend مَفْعِل ; sinon مَفْعَل.
  const v = vMudari === 'i' ? KASRA : FATHA;
  return `م${FATHA}${r1}${SUKUN}${r2}${v}${r3}`;
};

/** مِفْعَل — nom d'instrument. */
const nounTool = (r1, r2, r3) => {
  return `م${KASRA}${r1}${SUKUN}${r2}${FATHA}${r3}`;
};

/** أَفْعَل — élatif (comparatif/superlatif). */
const elative = (r1, r2, r3) => {
  return `أ${FATHA}${r1}${SUKUN}${r2}${FATHA}${r3}`;
};

// ─── Translittérations correspondantes ────────────────────────────────────

const tMadi = (r1, r2, r3, vMadi) =>
  `${translitLetter(r1)}a${translitLetter(r2)}${vowelTranslit(vMadi)}${translitLetter(r3)}a`;

const tMudari = (r1, r2, r3, vMudari) =>
  `ya${translitLetter(r1)}${translitLetter(r2)}${vowelTranslit(vMudari)}${translitLetter(r3)}u`;

const tAmr = (r1, r2, r3, vMudari) =>
  `${vMudari === 'u' ? 'u' : 'i'}${translitLetter(r1)}${translitLetter(r2)}${vowelTranslit(vMudari)}${translitLetter(r3)}`;

const tMasdar = (r1, r2, r3) =>
  `${translitLetter(r1)}a${translitLetter(r2)}${translitLetter(r3)}`;

const tActivePart = (r1, r2, r3) =>
  `${translitLetter(r1)}ā${translitLetter(r2)}i${translitLetter(r3)}`;

const tPassivePart = (r1, r2, r3) =>
  `ma${translitLetter(r1)}${translitLetter(r2)}ū${translitLetter(r3)}`;

const tNounPlace = (r1, r2, r3, vMudari) =>
  `ma${translitLetter(r1)}${translitLetter(r2)}${vMudari === 'i' ? 'i' : 'a'}${translitLetter(r3)}`;

const tNounTool = (r1, r2, r3) =>
  `mi${translitLetter(r1)}${translitLetter(r2)}a${translitLetter(r3)}`;

const tElative = (r1, r2, r3) =>
  `ʾa${translitLetter(r1)}${translitLetter(r2)}a${translitLetter(r3)}`;

// ─── Générateur principal ─────────────────────────────────────────────────

/**
 * Génère la liste de mots dérivés d'une racine donnée.
 * @param {{letters: string[], meaningFr: string, meaningEn?: string, vowelMadi: 'a'|'i'|'u', vowelMudari: 'a'|'i'|'u'}} root
 * @returns {Array} Liste de mots prêts pour `Word.create()` (avec rootSlug à résoudre).
 */
export const generateWordsForRoot = (root) => {
  const [r1, r2, r3] = root.letters;
  const vMadi = root.vowelMadi ?? 'a';
  const vMudari = root.vowelMudari ?? 'u';
  const rootSlug = root.letters.join('-');

  // Phrase d'exemple générique (le mot est cité tel quel).
  const ex = (w) => `${w}.`;

  // Sens de base — on dérive les traductions à partir du sens de la racine.
  // C'est une simplification : un humain réviserait pour chaque mot.
  const baseFr = root.meaningFr;
  const baseEn = root.meaningEn ?? '';

  const w = (form, translit, type, tense, pattern, fr, en) => ({
    rootSlug,
    arabic: form,
    transliteration: translit,
    translationFr: fr,
    translationEn: en || baseEn,
    type,
    ...(tense ? { tense } : {}),
    pattern,
    example: ex(form),
  });

  const verbMadi = madi(r1, r2, r3, vMadi);
  const verbMudari = mudari(r1, r2, r3, vMudari);
  const verbAmr = amr(r1, r2, r3, vMudari);
  const mas = masdar(r1, r2, r3);
  const act = activePart(r1, r2, r3);
  const pas = passivePart(r1, r2, r3);
  const place = nounPlace(r1, r2, r3, vMudari);
  const tool = nounTool(r1, r2, r3);
  const elat = elative(r1, r2, r3);

  return [
    w(verbMadi, tMadi(r1, r2, r3, vMadi), 'VERB', 'MADI', 'فَعَلَ',
      `il a ${baseFr}`, `he ${baseEn}`),
    w(verbMudari, tMudari(r1, r2, r3, vMudari), 'VERB', 'MUDARI', 'يَفْعُلُ',
      `il ${baseFr}`, `he ${baseEn}`),
    w(verbAmr, tAmr(r1, r2, r3, vMudari), 'VERB', 'AMR', 'اُفْعُلْ',
      `${baseFr} !`, `${baseEn}!`),
    w(mas, tMasdar(r1, r2, r3), 'MASDAR', null, 'فَعْل',
      `le fait de ${baseFr}`, `the act of ${baseEn}`),
    w(act, tActivePart(r1, r2, r3), 'ACTIVE_PART', null, 'فَاعِل',
      `celui qui ${baseFr}`, `the one who ${baseEn}`),
    w(pas, tPassivePart(r1, r2, r3), 'PASSIVE_PART', null, 'مَفْعُول',
      `${baseFr} (participe passé)`, `${baseEn} (past part.)`),
    w(place, tNounPlace(r1, r2, r3, vMudari), 'NOUN_PLACE', null, 'مَفْعَل',
      `lieu où l'on ${baseFr}`, `place where one ${baseEn}`),
    w(tool, tNounTool(r1, r2, r3), 'NOUN_TOOL', null, 'مِفْعَل',
      `instrument pour ${baseFr}`, `tool to ${baseEn}`),
    w(elat, tElative(r1, r2, r3), 'ELATIVE', null, 'أَفْعَل',
      `plus ${baseFr}`, `more ${baseEn}`),
  ];
};

export default generateWordsForRoot;
