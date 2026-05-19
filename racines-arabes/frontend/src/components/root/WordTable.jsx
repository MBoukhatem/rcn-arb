// WordTable — mots dérivés présentés en sections dropdown par type morphologique.
// Chaque type est un panneau repliable (<details>) contenant un tableau.
import { useTranslation } from 'react-i18next';
import { getTypeLabel, groupWordsByType } from '@/utils/morphology';

/**
 * @param {object} props
 * @param {Array} props.words - tableau plat de mots dérivés.
 */
const WordTable = ({ words = [] }) => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const groups = groupWordsByType(Array.isArray(words) ? words : []);

  if (groups.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-12 text-center">
        <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
          {t('root.noWords')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group, gi) => (
        <details
          key={group.type}
          open={gi === 0}
          className="group bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300"
        >
          {/* En-tête repliable */}
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3.5 select-none list-none">
            <span className="flex items-baseline gap-3">
              <span className="font-mono text-2xs font-bold tracking-[0.2em] text-sand-600 dark:text-sand-300">
                {String(gi + 1).padStart(2, '0')}
              </span>
              <span className="text-base font-bold tracking-tight text-ink dark:text-neutral-0">
                {getTypeLabel(group.type, t)}
              </span>
              {group.meta?.arabicName && (
                <span
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-sm text-accent-600 dark:text-accent-300"
                >
                  {group.meta.arabicName}
                </span>
              )}
            </span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-2xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                {group.words.length}
              </span>
              {/* Chevron : pivote quand le panneau est ouvert */}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 text-accent-600 dark:text-sand-300 transition-transform duration-200 group-open:rotate-180"
              >
                <path
                  d="M3 6l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>

          {/* Tableau des mots du type */}
          <div className="overflow-x-auto border-t border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                  <th className="px-5 py-2.5 font-bold">{t('word.arabic')}</th>
                  <th className="px-5 py-2.5 font-bold">{t('word.transliteration')}</th>
                  <th className="px-5 py-2.5 font-bold">{t('morphology.patternLabel')}</th>
                  <th className="px-5 py-2.5 font-bold">{t('word.translation')}</th>
                </tr>
              </thead>
              <tbody>
                {group.words.map((w) => {
                  const translation = isEnglish
                    ? (w.translationEn ?? w.translationFr)
                    : (w.translationFr ?? w.translationEn);
                  return (
                    <tr
                      key={w._id ?? w.id ?? w.arabic}
                      className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-sand-50 dark:hover:bg-neutral-850 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span
                          lang="ar"
                          dir="rtl"
                          className="font-arabic text-2xl font-bold text-ink dark:text-neutral-0"
                        >
                          {w.arabic}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs italic text-neutral-600 dark:text-neutral-400">
                        {w.transliteration || '—'}
                      </td>
                      <td className="px-5 py-3">
                        {w.pattern ? (
                          <span
                            lang="ar"
                            dir="rtl"
                            className="font-arabic text-base text-accent-600 dark:text-accent-300"
                          >
                            {w.pattern}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                        {translation || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
};

export default WordTable;
