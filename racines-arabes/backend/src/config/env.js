// Chargement et validation des variables d'environnement
import dotenv from 'dotenv';

dotenv.config();

// Variables strictement requises au démarrage
const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Variables d'environnement manquantes : ${missing.join(', ')}. ` +
      `Copiez .env.example en .env et renseignez les valeurs.`
  );
}

// Objet de configuration figé — source unique de vérité
export const env = Object.freeze({
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
});
