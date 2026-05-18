// Point d'entrée du serveur — connexion DB puis démarrage HTTP
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';

let server;

const start = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    console.log(`🚀 API démarrée sur le port ${env.PORT} (${env.NODE_ENV})`);
    console.log(`   Santé : http://localhost:${env.PORT}/api/health`);
  });
};

// Arrêt propre : ferme le serveur HTTP puis la connexion MongoDB
const shutdown = async (signal) => {
  console.log(`\n${signal} reçu — arrêt en cours...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Filet de sécurité : rejet de promesse non géré
process.on('unhandledRejection', (reason) => {
  console.error('❌ Rejet de promesse non géré :', reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

start();
