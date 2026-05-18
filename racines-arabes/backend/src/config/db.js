// Connexion / déconnexion MongoDB via Mongoose
import mongoose from 'mongoose';
import { env } from './env.js';

// Évite les warnings sur les requêtes hors schéma
mongoose.set('strictQuery', true);

/**
 * Établit la connexion à MongoDB.
 * En cas d'échec au démarrage : log puis arrêt du processus.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Échec de connexion à MongoDB : ${error.message}`);
    process.exit(1);
  }
};

/**
 * Ferme proprement la connexion MongoDB.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('🔌 MongoDB déconnecté.');
  } catch (error) {
    console.error(`⚠️  Erreur lors de la déconnexion MongoDB : ${error.message}`);
  }
};
