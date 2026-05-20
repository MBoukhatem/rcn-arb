// WordForm — formulaire éditorial d'un mot dérivé (création / édition).
// Champs : arabe, translittération, traductions, type morphologique, temps verbal,
// schème, exemple, notes. Réutilisé par les pages Détail racine et Recherche.
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';
import { WORD_TYPES, VERB_TENSES, getTypeLabel } from '@/utils/morphology';

const SELECT_CLASS =
  'w-full h-11 px-3.5 text-sm bg-neutral-0 text-ink ' +
  'transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/30 ' +
  'dark:bg-neutral-950 dark:text-neutral-0 ' +
  'dark:focus:ring-accent-300/30';

const LABEL_CLASS =
  'block text-2xs font-semibold uppercase tracking-[0.18em] text-ink dark:text-neutral-0 mb-2';

// Valeurs par défaut d'un nouveau mot — utiles pour réinitialiser un formulaire.
export const EMPTY_WORD = {
  arabic: '',
  transliteration: '',
  translationFr: '',
  translationEn: '',
  type: 'VERB',
  tense: 'MADI',
  pattern: '',
  example: '',
  notes: '',
};

const WordForm = ({ values, onChange }) => {
  const { t } = useTranslation();
  const handle = (e) => onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4">
      <Input
        label={t('word.arabic')}
        name="arabic"
        value={values.arabic}
        onChange={handle}
        placeholder={t('word.arabicPlaceholder')}
        required
      />
      <Input
        label={t('word.transliteration')}
        name="transliteration"
        value={values.transliteration}
        onChange={handle}
        required
      />
      <Input
        label={t('word.translationFr')}
        name="translationFr"
        value={values.translationFr}
        onChange={handle}
        required
      />
      <Input
        label={t('word.translationEn')}
        name="translationEn"
        value={values.translationEn}
        onChange={handle}
      />
      <div>
        <label className={LABEL_CLASS} htmlFor="word-type">
          {t('word.type')}
        </label>
        <select
          id="word-type"
          name="type"
          value={values.type}
          onChange={handle}
          className={SELECT_CLASS}
        >
          {WORD_TYPES.map((code) => (
            <option key={code} value={code}>
              {getTypeLabel(code, t)}
            </option>
          ))}
        </select>
      </div>
      {values.type === 'VERB' && (
        <div>
          <label className={LABEL_CLASS} htmlFor="word-tense">
            {t('word.tense')}
          </label>
          <select
            id="word-tense"
            name="tense"
            value={values.tense}
            onChange={handle}
            className={SELECT_CLASS}
          >
            {VERB_TENSES.map((code) => (
              <option key={code} value={code}>
                {t(`morphology.tense.${code}`)}
              </option>
            ))}
          </select>
        </div>
      )}
      <Input
        label={t('word.pattern')}
        name="pattern"
        value={values.pattern}
        onChange={handle}
        required
      />
      <Input
        label={t('word.example')}
        name="example"
        value={values.example}
        onChange={handle}
      />
      <Input
        label={t('word.notes')}
        name="notes"
        value={values.notes}
        onChange={handle}
      />
    </div>
  );
};

export default WordForm;
