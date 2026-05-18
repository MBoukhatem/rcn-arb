// Page d'inscription — formulaire name/email/password/confirmation avec validation temps réel.
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

  // Validation champ par champ — clé i18n d'erreur ou null si valide.
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
        className="mx-auto max-w-md"
      >
        <h1 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('auth.registerTitle')}
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 rounded-xl border border-neutral-200 bg-neutral-0 p-6 sm:p-8 dark:border-neutral-700 dark:bg-neutral-850"
        >
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
            {t('auth.submitRegister')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-accent-600 hover:underline dark:text-accent-400"
          >
            {t('auth.submitLogin')}
          </Link>
        </p>
      </motion.div>
    </PageWrapper>
  );
};

export default Register;
