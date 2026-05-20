// Page détail d'un utilisateur — /admin/users/:id (admin uniquement).
// Présentation éditoriale du profil, actions modifier / supprimer.
import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import UserForm, { emptyUser } from '@/components/user/UserForm';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getUser, updateUser, deleteUser } from '@/services/user.service';

const formatDate = (iso, locale) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: user, loading, error, refetch } = useFetch(
    () => getUser(id),
    [id],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState(emptyUser());
  const [editSaving, setEditSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSelf = useCallback(
    () => String(user?._id) === String(currentUser?._id),
    [user, currentUser],
  );

  const openEdit = () => {
    setEditValues({
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      avatarUrl: user?.avatarUrl ?? '',
      nativeLanguage: user?.nativeLanguage ?? 'fr',
      role: user?.role ?? 'user',
    });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editValues.name.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    setEditSaving(true);
    try {
      await updateUser(id, editValues);
      toast.success(t('profile.updateSuccess'));
      setEditOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(id);
      toast.success(t('profile.accountDeleted'));
      navigate('/admin/users', { replace: true });
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !user) {
    return (
      <PageWrapper>
        <EmptyState
          tone="error"
          eyebrow={t('common.error')}
          title={error?.message ?? t('errors.notFound')}
          action={
            <Button as={Link} to="/admin/users" variant="primary" size="sm">
              ← {t('admin.usersTitle')}
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  const initials = (user.name || user.email || '?')
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <PageWrapper>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-hidden"
      >
        {/* Barre supérieure */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-accent-700 dark:border-accent-300">
          <span className="font-mono text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
            — UTILISATEUR / {user._id?.slice(-6) ?? '—'}
          </span>
          <Link
            to="/admin/users"
            className="text-2xs font-semibold uppercase tracking-[0.16em] text-accent-600 dark:text-sand-300 hover:underline"
          >
            ← {t('admin.usersTitle')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Avatar / identité */}
          <div className="relative lg:col-span-5 bg-neutral-950 dark:bg-neutral-0 text-neutral-0 dark:text-neutral-950 p-10 sm:p-14 flex flex-col items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="relative h-32 w-32 object-cover border border-current"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="relative flex h-32 w-32 items-center justify-center border border-current font-extrabold text-4xl tracking-tight">
                {initials}
              </div>
            )}
            <p className="relative mt-6 text-3xl font-extrabold tracking-tight">
              {user.name || '—'}
            </p>
            <p className="relative mt-2 font-mono text-xs uppercase tracking-[0.18em] opacity-70">
              {user.email}
            </p>
            <p className="relative mt-4">
              <span
                className={
                  user.role === 'admin'
                    ? 'inline-block bg-accent-300/20 dark:bg-accent-500/20 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.16em]'
                    : 'inline-block bg-neutral-200/20 dark:bg-neutral-700/30 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.16em]'
                }
              >
                {t(`admin.roles.${user.role || 'user'}`)}
              </span>
            </p>
          </div>

          {/* Détails à droite */}
          <div className="lg:col-span-7 p-8 sm:p-12">
            <p className="text-2xs font-bold uppercase tracking-[0.24em] text-accent-500 dark:text-accent-300">
              — {t('profile.bio')}
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {user.bio || '—'}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('profile.nativeLanguage')}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ink dark:text-neutral-0">
                  {user.nativeLanguage || '—'}
                </p>
              </div>
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('admin.role')}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-ink dark:text-neutral-0">
                  {user.role}
                </p>
              </div>
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('admin.createdAt')}
                </p>
                <p className="mt-2 text-sm text-ink dark:text-neutral-0">
                  {formatDate(user.createdAt, i18n.language)}
                </p>
              </div>
              <div>
                <p className="text-2xs font-bold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                  — {t('admin.updatedAt')}
                </p>
                <p className="mt-2 text-sm text-ink dark:text-neutral-0">
                  {formatDate(user.updatedAt, i18n.language)}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={openEdit}>
                {t('admin.editUser')}
              </Button>
              {!isSelf() && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  {t('admin.deleteUser')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Modale édition */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title={t('admin.editUser')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={submitEdit}
              loading={editSaving}
              disabled={editSaving}
            >
              {t('common.save')}
            </Button>
          </>
        }
      >
        <UserForm
          values={editValues}
          onChange={setEditValues}
          disableRole={isSelf()}
        />
      </Modal>

      {/* Modale suppression */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('admin.deleteUser')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleting}
              disabled={deleting}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {t('admin.deleteConfirm')}
          </p>
          <p className="text-base font-bold text-ink dark:text-neutral-0">
            {user.name}{' '}
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              · {user.email}
            </span>
          </p>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default AdminUserDetail;
