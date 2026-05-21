// Page d'inscription — formulaire éditorial, panneau visuel à droite.
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading, register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (name, val, all) => {
    if (name === 'name') {
      if (!val.trim()) return 'validation.nameRequired';
      if (val.trim().length < 2 || val.trim().length > 60) return 'validation.nameLength';
    }
    if (name === 'email') {
      if (!val.trim()) return 'validation.emailRequired';
      if (!EMAIL_RE.test(val)) return 'validation.emailInvalid';
    }
    if (name === 'password') {
      if (!val) return 'validation.passwordRequired';
      if (val.length < 8) return 'validation.passwordMin';
    }
    if (name === 'confirmPassword') {
      if (!val) return 'validation.confirmRequired';
      if (val !== all.password) return 'auth.passwordMismatch';
    }
    return null;
  };

  const errors = {
    name: validateField('name', values.name, values),
    email: validateField('email', values.email, values),
    password: validateField('password', values.password, values),
    confirmPassword: validateField('confirmPassword', values.confirmPassword, values),
  };
  const isValid = !Object.values(errors).some(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;

    setSubmitting(true);
    try {
      const { name, email, password } = values;
      await register({ name, email, password });
      toast.success(t('auth.registerSuccess'));
      navigate('/', { replace: true });
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
        className="-mt-4 sm:-mt-6 lg:-mt-8 mx-auto grid w-full max-w-4xl grid-cols-1 lg:grid-cols-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-950 dark:border-neutral-0"
      >
        {/* Formulaire */}
        <div className="p-5 sm:p-6 lg:p-8 order-2 lg:order-1">
          <p className="text-2xs font-bold uppercase tracking-[0.28em] text-accent-500 dark:text-accent-300">
            — {t('auth.sectionRegister')}
          </p>
          <h1
            className="mt-1.5 font-extrabold tracking-tight leading-[1.1] text-ink dark:text-neutral-0"
            style={{ fontSize: 'clamp(1.375rem, 2.6vw, 1.75rem)' }}
          >
            {t('auth.registerTitle')}
          </h1>

          <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
            <Input
              label={t('auth.name')}
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              error={touched.name && errors.name ? t(errors.name) : ''}
              required
            />
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
            <Input
              label={t('auth.confirmPassword')}
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={
                touched.confirmPassword && errors.confirmPassword
                  ? t(errors.confirmPassword)
                  : ''
              }
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
              {t('auth.submitRegister')} →
            </Button>
          </form>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {t('auth.hasAccount')}
            </p>
            <Link
              to="/login"
              className="mt-1.5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-500 dark:text-accent-300 hover:underline underline-offset-4"
            >
              {t('auth.submitLogin')} →
            </Link>
          </div>
        </div>

        {/* Panneau visuel (desktop uniquement) — calligraphie + accroche */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-5 lg:p-6 xl:p-8 order-1 lg:order-2">
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
              — {t('auth.newAccount')}
            </p>
            <h2
              className="mt-3 font-extrabold tracking-tight leading-[1.1]"
              style={{ fontSize: 'clamp(1.25rem, 1.8vw, 2rem)' }}
            >
              {t('auth.joinUs')}
            </h2>
          </div>
          <div className="relative mt-6">
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic font-bold opacity-90 leading-none"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
            >
              تَفَضَّل
            </p>
            <p className="mt-2 text-2xs uppercase tracking-[0.28em] opacity-70">
              tafaḍḍal · be our guest
            </p>
          </div>
        </aside>
      </motion.div>
    </PageWrapper>
  );
};

export default Register;
