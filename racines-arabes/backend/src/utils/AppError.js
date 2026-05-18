// Classe d'erreur opérationnelle — erreurs métier maîtrisées (cf. PROJET.md §8.5)
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
