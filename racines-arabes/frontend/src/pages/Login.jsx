// Page de connexion — formulaire éditorial, panneau visuel à gauche.
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (name, val) => {
    if (name === 'email') {
      if (!val.trim()) return 'validation.emailRequired';
      if (!EMAIL_RE.test(val)) return 'validation.emailInvalid';
    }
    if (name === 'password') {
      if (!val) return 'validation.passwordRequired';
      if (val.length < 8) return 'validation.passwordMin';
    }
    return null;
  };

  const errors = {
    email: validateField('email', values.email),
    password: validateField('password', values.password),
  };
  const isValid = !errors.email && !errors.password;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;

    setSubmitting(true);
    try {
      await login(values);
      toast.success(t('auth.loginSuccess'));
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto grid w-full max-w-5xl grid-cols-1 lg:grid-cols-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-950 dark:border-neutral-0"
      >
        {/* Panneau visuel */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative">
            <p className="text-2xs font-bold uppercase tracking-[0.32em] text-accent-300 dark:text-accent-500">
              — {t('auth.session')}
            </p>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
              {t('auth.welcomeBack')}
            </h2>
          </div>
          <div className="relative">
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-7xl font-bold opacity-90"
            >
              أهلاً
            </p>
            <p className="mt-3 text-2xs uppercase tracking-[0.28em] opacity-70">
              ahlan · welcome
            </p>
          </div>
        </aside>

        {/* Formulaire */}
        <div className="p-8 sm:p-12">
          <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
            — {t('auth.sectionLogin')}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink dark:text-neutral-0">
            {t('auth.loginTitle')}
          </h1>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Input
              label={t('auth.email')}
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && errors.email ? t(errors.email) : ''}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
            <Input
              label={t('auth.password')}
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password && errors.password ? t(errors.password) : ''}
              hint={!errors.password ? t('auth.passwordHint') : ''}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting}
              className="w-full"
            >
              {t('auth.submitLogin')} →
            </Button>
          </form>

          <div className="mt-8 pt-6">
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {t('auth.noAccount')}
            </p>
            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-500 dark:text-accent-300 hover:underline underline-offset-4"
            >
              {t('auth.submitRegister')} →
            </Link>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Login;
