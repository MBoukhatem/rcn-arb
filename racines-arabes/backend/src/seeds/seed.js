// Script de seed — vide puis repeuple la base (cf. PROJET.md §14)
// Lancé via `npm run seed`.
//
// Les 6 racines originales (ك-ت-ب, د-ر-س, ع-ل-م, ك-س-ر, ف-ت-ح, ج-م-ل) ont
// leurs mots curatés à la main (qualité vérifiée). Les ~94 racines ajoutées
// reçoivent leurs dérivés via le générateur morphologique
// `wordsGenerator.generateWordsForRoot`.
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Root from '../models/Root.js';
import Word from '../models/Word.js';
import Favorite from '../models/Favorite.js';
import Revision from '../models/Revision.js';
import { buildSlug } from '../utils/arabic.js';
import { rootsData } from './roots.data.js';
import { wordsData } from './words.data.js';
import { generateWordsForRoot } from './wordsGenerator.js';

const run = async () => {
  await connectDB();

  // 1. Vide les collections existantes
  await Promise.all([
    User.deleteMany({}),
    Root.deleteMany({}),
    Word.deleteMany({}),
    Favorite.deleteMany({}),
    Revision.deleteMany({}),
  ]);
  console.log('🧹 Collections vidées (users, roots, words, favorites, revisions).');

  // 2. Crée l'utilisateur de démo (le hook pre('save') hache le mot de passe)
  const demoUser = await User.create({
    name: 'Utilisateur Démo',
    email: 'demo@racines.app',
    password: 'demo1234',
  });
  console.log(`👤 Utilisateur de démo créé : ${demoUser.email}`);

  // 3. Insère les racines (le hook génère le slug à partir des lettres)
  const roots = await Root.create(
    rootsData.map((root) => {
      // On ne stocke pas vowelMadi/vowelMudari dans le modèle Root — ce sont
      // des métadonnées internes au générateur, retirées avant insertion.
      const { vowelMadi: _vm, vowelMudari: _vmu, ...persisted } = root;
      return { ...persisted, createdBy: demoUser._id };
    })
  );
  console.log(`🌱 ${roots.length} racines insérées.`);

  // Index des racines par slug pour résoudre la racine de chaque mot
  const rootBySlug = new Map(roots.map((root) => [root.slug, root]));

  // 4. Combine mots curatés (qualité vérifiée) + mots générés (94 racines).
  // Les slugs déjà couverts par wordsData ne sont pas régénérés.
  const curatedSlugs = new Set(
    wordsData.map((w) => buildSlug(w.rootSlug.split('-'))),
  );

  const generated = [];
  for (const root of rootsData) {
    const slug = buildSlug(root.letters);
    if (curatedSlugs.has(slug)) continue; // mots déjà fournis manuellement
    generated.push(...generateWordsForRoot(root));
  }

  const allWords = [...wordsData, ...generated];

  // 5. Résout la racine de chaque mot via son slug
  const wordDocs = allWords.map((word) => {
    const slug = buildSlug(word.rootSlug.split('-'));
    const root = rootBySlug.get(slug);
    if (!root) {
      throw new Error(`Racine introuvable pour le slug « ${word.rootSlug} ».`);
    }
    const rest = { ...word };
    delete rest.rootSlug;
    return { ...rest, root: root._id, createdBy: demoUser._id };
  });
  const words = await Word.create(wordDocs);
  console.log(
    `📚 ${words.length} mots dérivés insérés (${wordsData.length} curatés + ${generated.length} générés).`,
  );

  // 6. Récapitulatif
  console.log('\n─── Récapitulatif du seed ───');
  console.log(`   Racines : ${roots.length}`);
  console.log(`   Mots    : ${words.length}`);
  console.log(`   Démo    : ${demoUser.email} (mot de passe : demo1234)`);
  console.log('─────────────────────────────\n');

  await disconnectDB();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(`❌ Échec du seed : ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
