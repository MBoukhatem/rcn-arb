// Footer — pied de page sobre, monochrome.
// Design System §5.8.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FOOTER_LINK =
  'text-sm text-neutral-500 hover:text-neutral-900 transition-colors ' +
  'dark:text-neutral-400 dark:hover:text-neutral-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 ' +
  'dark:focus-visible:ring-accent-400 rounded-sm';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span
            lang="ar"
            className="font-arabic text-ar-sm font-bold text-neutral-900 dark:text-neutral-50"
          >
            نظام الجذور
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {t('about.morphologyTitle')}
          </span>
        </div>

        <nav className="flex items-center gap-6" aria-label="Liens du pied de page">
          <Link to="/explorer" className={FOOTER_LINK}>
            {t('nav.explorer')}
          </Link>
          <Link to="/about" className={FOOTER_LINK}>
            {t('nav.about')}
          </Link>
        </nav>

        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          © {year} · {t('about.title')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
