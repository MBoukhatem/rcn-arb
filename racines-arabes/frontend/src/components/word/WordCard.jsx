// WordCard — carte d'un mot dérivé (arabe, schème, traduction, badges).
// Design System §5.9.
import { useTranslation } from 'react-i18next';
import { getTypeLabel, TYPE_META } from '@/utils/morphology';
import Badge from '@/components/ui/Badge';

const CARD_BASE =
  'group relative rounded-xl border bg-neutral-0 dark:bg-neutral-850 ' +
  'border-neutral-200 dark:border-neutral-700 p-6 transition-all duration-200 ease-soft';

/**
 * @param {object} props
 * @param {object} props.word - { arabic, transliteration, translationFr, translationEn, type, tense, pattern, example, notes }
 * @param {React.ReactNode} [props.actions] - noeud d'actions affiché en coin (ex. FavoriteButton).
 * @param {string} [props.className]
 */
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
      {/* Zone d'actions en coin */}
      {actions && <div className="absolute top-3 right-3">{actions}</div>}

      {/* Mot arabe en vedette */}
      <p
        lang="ar"
        dir="rtl"
        className="font-arabic text-ar-lg sm:text-ar-xl font-bold text-neutral-900 dark:text-neutral-50 pr-10"
      >
        {word.arabic}
      </p>

      {/* Translittération */}
      {word.transliteration && (
        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500 italic">
          {word.transliteration}
        </p>
      )}

      {/* Badges : type morphologique (+ temps si verbe) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge accent={meta?.badgeAccent ?? false}>
          {getTypeLabel(word.type, t)}
        </Badge>
        {isVerb && word.tense && (
          <Badge>{t(`morphology.tense.${word.tense}`)}</Badge>
        )}
      </div>

      {/* Schème (pattern) en arabe */}
      {word.pattern && (
        <div className="mt-4">
          <p className="text-2xs uppercase tracking-wide font-semibold text-neutral-400 dark:text-neutral-500">
            {t('morphology.patternLabel')}
          </p>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-ar-sm text-neutral-500 dark:text-neutral-400"
          >
            {word.pattern}
          </p>
        </div>
      )}

      {/* Traduction */}
      {translation && (
        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
          {translation}
        </p>
      )}

      {/* Exemple */}
      {word.example && (
        <p
          lang="ar"
          dir="rtl"
          className="mt-4 text-sm italic text-neutral-500 dark:text-neutral-400 font-arabic bg-neutral-50 dark:bg-neutral-900 rounded-md p-3 border-r-2 border-accent-300 dark:border-accent-400/40"
        >
          {word.example}
        </p>
      )}

      {/* Notes */}
      {word.notes && (
        <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
          {word.notes}
        </p>
      )}
    </article>
  );
};

export default WordCard;
