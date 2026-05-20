// Script idempotent — crée un utilisateur admin OU le promeut s'il existe déjà.
// Lancé via `npm run seed:admin`.
//
// Identifiants par défaut (modifiables via variables d'env) :
//   email    : admin@racines.app
//   password : admin1234
//   name     : Administrateur
//
// Surcharge possible :
//   ADMIN_EMAIL=… ADMIN_PASSWORD=… ADMIN_NAME=… npm run seed:admin
import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

const DEFAULT_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@racines.app';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin1234';
const DEFAULT_NAME = process.env.ADMIN_NAME ?? 'Administrateur';

const run = async () => {
  await connectDB();

  // Recherche d'un utilisateur existant avec cet e-mail.
  // `+password` n'est pas nécessaire : on ne lit pas l'ancien mot de passe,
  // on écrase seulement les champs nécessaires.
  const existing = await User.findOne({ email: DEFAULT_EMAIL });

  if (existing) {
    // Promotion ou réinitialisation du mot de passe pour cet admin.
    const wasAdmin = existing.role === 'admin';
    existing.role = 'admin';
    existing.password = DEFAULT_PASSWORD;
    if (!existing.name) existing.name = DEFAULT_NAME;
    await existing.save(); // le hook pre('save') re-hache le mot de passe

    console.log(
      wasAdmin
        ? `🔑 Admin existant — mot de passe réinitialisé : ${existing.email}`
        : `⬆️  Utilisateur promu admin : ${existing.email}`,
    );
  } else {
    // Création d'un nouvel admin.
    const admin = await User.create({
      name: DEFAULT_NAME,
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
      role: 'admin',
    });
    console.log(`👑 Nouvel admin créé : ${admin.email}`);
  }

  console.log('\n─── Identifiants admin ───');
  console.log(`   Email    : ${DEFAULT_EMAIL}`);
  console.log(`   Password : ${DEFAULT_PASSWORD}`);
  console.log('──────────────────────────\n');

  await disconnectDB();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(`❌ Échec du seed admin : ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
