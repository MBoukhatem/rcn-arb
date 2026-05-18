// WordCard — carte d'un mot dérivé, design éditorial avec en-tête typographique.
import { useTranslation } from 'react-i18next';
import { getTypeLabel, TYPE_META } from '@/utils/morphology';
import Badge from '@/components/ui/Badge';

const CARD_BASE =
  'group relative bg-neutral-0 dark:bg-neutral-950 ' +
  'border border-neutral-950 dark:border-neutral-0 p-6 transition-colors duration-200 h-full';

const WordCard = ({ word, actions, className = '' }) => {
  const { t, i18n } = useTranslation();

  if (!word) return null;

  const isEnglish = i18n.language?.startsWith('en');
  const translation = isEnglish
    ? (word.translationEn ?? word.translationFr)
    : (word.translationFr ?? word.translationEn);
  const meta = TYPE_META[word.type];
  const isVerb = word.type === 'VERB';

  return (
    <article className={`${CARD_BASE} ${className}`}>
      {/* En-tête : type morphologique + actions */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-2xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-300">
          — {getTypeLabel(word.type, t)}
        </span>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>

      {/* Badge temps verbal */}
      {isVerb && word.tense && (
        <div className="mt-3">
          <Badge>{t(`morphology.tense.${word.tense}`)}</Badge>
        </div>
      )}

      {/* Mot arabe en vedette */}
      <p
        lang="ar"
        dir="rtl"
        className="mt-4 font-arabic text-4xl sm:text-5xl font-bold text-neutral-950 dark:text-neutral-0 leading-tight"
      >
        {word.arabic}
      </p>

      {/* Translittération */}
      {word.transliteration && (
        <p className="mt-2 text-sm italic text-neutral-500 dark:text-neutral-400">
          / {word.transliteration} /
        </p>
      )}

      {/* Filet pointillé */}
      <span
        aria-hidden="true"
        className="block mt-4 h-px w-full bg-neutral-950 dark:bg-neutral-0 opacity-30"
      />

      {/* Schème */}
      {word.pattern && (
        <div className="mt-4 flex items-baseline gap-3">
          <p className="text-2xs uppercase tracking-[0.18em] font-bold text-neutral-700 dark:text-neutral-300">
            Schème
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-lg text-accent-500 dark:text-accent-300"
          >
            {word.pattern}
          </p>
        </div>
      )}

      {/* Traduction */}
      {translation && (
        <p className="mt-4 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {translation}
        </p>
      )}

      {/* Exemple */}
      {word.example && (
        <div className="mt-4 border-l-2 border-accent-500 dark:border-accent-300 pl-3">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-base italic text-neutral-600 dark:text-neutral-400"
          >
            {word.example}
          </p>
        </div>
      )}

      {/* Notes */}
      {word.notes && (
        <p className="mt-3 text-2xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-500">
          ↳ {word.notes}
        </p>
      )}

      {/* Marqueur méta arabe en bas */}
      {meta?.arabicName && (
        <p
          lang="ar"
          dir="rtl"
          className="mt-5 pt-3 border-t border-neutral-300 dark:border-neutral-700 font-arabic text-sm text-neutral-500 dark:text-neutral-500"
        >
          {meta.arabicName}
        </p>
      )}
    </article>
  );
};

export default WordCard;
