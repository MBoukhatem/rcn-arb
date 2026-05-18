import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES, NATIVE_LANGUAGES } from '../utils/constants.js';

// Regex e-mail simple mais robuste
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BCRYPT_SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire.'],
      trim: true,
      minlength: [2, 'Le nom doit comporter au moins 2 caractères.'],
      maxlength: [60, 'Le nom ne peut pas dépasser 60 caractères.'],
    },
    email: {
      type: String,
      required: [true, "L'adresse e-mail est obligatoire."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "L'adresse e-mail n'est pas valide."],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire.'],
      minlength: [8, 'Le mot de passe doit comporter au moins 8 caractères.'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: "Le rôle « {VALUE} » n'est pas valide.",
      },
      default: 'user',
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [280, 'La biographie ne peut pas dépasser 280 caractères.'],
    },
    nativeLanguage: {
      type: String,
      enum: {
        values: NATIVE_LANGUAGES,
        message: "La langue maternelle « {VALUE} » n'est pas valide.",
      },
      default: 'fr',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hachage du mot de passe avant sauvegarde, uniquement si modifié
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  return next();
});

// Comparaison d'un mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

// Ne jamais exposer le mot de passe ni le champ technique __v
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
