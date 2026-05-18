// Script de seed — vide puis repeuple la base (cf. PROJET.md §14)
// Lancé via `npm run seed`.
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Root from '../models/Root.js';
import Word from '../models/Word.js';
import Favorite from '../models/Favorite.js';
import { buildSlug } from '../utils/arabic.js';
import { rootsData } from './roots.data.js';
import { wordsData } from './words.data.js';

const run = async () => {
  await connectDB();

  // 1. Vide les collections existantes
  await Promise.all([
    User.deleteMany({}),
    Root.deleteMany({}),
    Word.deleteMany({}),
    Favorite.deleteMany({}),
  ]);
  console.log('🧹 Collections vidées (users, roots, words, favorites).');

  // 2. Crée l'utilisateur de démo (le hook pre('save') hache le mot de passe)
  const demoUser = await User.create({
    name: 'Utilisateur Démo',
    email: 'demo@racines.app',
    password: 'demo1234',
  });
  console.log(`👤 Utilisateur de démo créé : ${demoUser.email}`);

  // 3. Insère les racines (le hook génère le slug à partir des lettres)
  const roots = await Root.create(
    rootsData.map((root) => ({ ...root, createdBy: demoUser._id }))
  );
  console.log(`🌱 ${roots.length} racines insérées.`);

  // Index des racines par slug pour résoudre la racine de chaque mot
  const rootBySlug = new Map(roots.map((root) => [root.slug, root]));

  // 4. Insère les mots en résolvant la racine de chacun via son slug
  const wordDocs = wordsData.map((word) => {
    // Le slug fourni est normalisé pour correspondre à celui du modèle Root
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
  console.log(`📚 ${words.length} mots dérivés insérés.`);

  // 5. Récapitulatif
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
