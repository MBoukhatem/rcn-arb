// Footer — bandeau bleu turquoise profond, texte crème, accents or.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FOOTER_LINK =
  'text-2xs font-semibold uppercase tracking-[0.18em] text-sand-100/70 hover:text-sand-50 transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-300';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-accent-800 dark:bg-neutral-850 text-sand-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Bloc marque */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span
              lang="ar"
              className="font-arabic text-4xl font-bold text-sand-50 leading-none"
            >
              نظام الجذور
            </span>
          </div>
          <p className="text-sm max-w-md text-sand-100/70">
            {t('about.morphologyTitle')}. {t('about.intro')}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-px w-12 bg-sand-300" aria-hidden="true" />
            <span className="text-2xs font-semibold uppercase tracking-[0.24em] text-sand-300">
              EST. {year}
            </span>
          </div>
        </div>

        {/* Bloc nav */}
        <div className="md:col-span-3">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-sand-50 mb-4">
            — Index
          </p>
          <nav className="flex flex-col gap-3" aria-label="Liens du pied de page">
            <Link to="/" className={FOOTER_LINK}>
              {t('nav.home')}
            </Link>
            <Link to="/explorer" className={FOOTER_LINK}>
              {t('nav.explorer')}
            </Link>
            <Link to="/about" className={FOOTER_LINK}>
              {t('nav.about')}
            </Link>
          </nav>
        </div>

        {/* Bloc compte */}
        <div className="md:col-span-4">
          <p className="text-2xs font-bold uppercase tracking-[0.24em] text-sand-50 mb-4">
            — Compte
          </p>
          <nav className="flex flex-col gap-3" aria-label="Compte">
            <Link to="/login" className={FOOTER_LINK}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className={FOOTER_LINK}>
              {t('nav.register')}
            </Link>
          </nav>
        </div>
      </div>

      {/* Barre de bas de page — légèrement plus foncée que le footer */}
      <div className="bg-accent-900 dark:bg-neutral-900">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs uppercase tracking-[0.2em] text-sand-100/60">
            © {year} · {t('about.title')}
          </p>
          <p className="text-2xs uppercase tracking-[0.2em] text-sand-100/60">
            Azure <span className="text-sand-300">/</span>{' '}
            Gold <span className="text-sand-300">/</span>{' '}
            Cream
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
