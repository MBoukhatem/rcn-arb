// Page administration — liste des utilisateurs.
// Pour chaque ligne : Voir · Modifier · Supprimer.
// L'utilisateur ne peut pas se supprimer lui-même via cette interface.
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { ViewButton, EditButton, DeleteButton } from '@/components/ui/ActionButtons';
import UserForm, { emptyUser } from '@/components/user/UserForm';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/hooks/useAuth';
import { getUsers, updateUser, deleteUser } from '@/services/user.service';

const AdminUsers = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useFetch(
    () => getUsers({ page, limit: 20 }),
    [page],
  );

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? users.length;

  // ── Édition ──
  const [editUser, setEditUser] = useState(null);
  const [editValues, setEditValues] = useState(emptyUser());
  const [editSaving, setEditSaving] = useState(false);

  const openEdit = (u) => {
    setEditValues({
      name: u?.name ?? '',
      bio: u?.bio ?? '',
      avatarUrl: u?.avatarUrl ?? '',
      nativeLanguage: u?.nativeLanguage ?? 'fr',
      role: u?.role ?? 'user',
    });
    setEditUser(u);
  };

  const submitEdit = async () => {
    if (!editValues.name.trim()) {
      toast.error(t('errors.validation'));
      return;
    }
    setEditSaving(true);
    try {
      // Évite d'envoyer des champs vides côté `bio`/`avatarUrl` qui doivent
      // rester optionnels mais peuvent être effacés intentionnellement.
      await updateUser(editUser._id, editValues);
      toast.success(t('profile.updateSuccess'));
      setEditUser(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setEditSaving(false);
    }
  };

  // ── Suppression ──
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      toast.success(t('profile.accountDeleted'));
      setUserToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err?.message ?? t('errors.generic'));
    } finally {
      setDeleting(false);
    }
  };

  const isSelf = useCallback(
    (u) => String(u?._id) === String(currentUser?._id),
    [currentUser],
  );

  return (
    <PageWrapper title={t('admin.usersTitle')} eyebrow={t('admin.eyebrow')}>
      <header className="-mt-6 mb-10 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-base text-neutral-700 dark:text-neutral-300">
          {t('admin.usersSubtitle')}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-arabic text-3xl font-bold text-accent-600 dark:text-sand-300">
            {totalCount}
          </span>
          <span className="text-2xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            {t('admin.users')}
          </span>
        </div>
      </header>

      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <Spinner size="lg" />
          <p className="text-2xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {t('common.loading')}
          </p>
        </div>
      )}

      {!loading && error && (
        <EmptyState
          tone="error"
          eyebrow={t('common.error')}
          title={error?.message ?? t('errors.generic')}
        />
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState title={t('common.noResults')} />
      )}

      {!loading && !error && users.length > 0 && (
        <div className="bg-neutral-0 dark:bg-neutral-900 border border-accent-700 dark:border-accent-300 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-850 text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                <th className="px-5 py-2.5">{t('profile.name')}</th>
                <th className="px-5 py-2.5">{t('profile.email')}</th>
                <th className="px-5 py-2.5">{t('admin.role')}</th>
                <th className="px-5 py-2.5">{t('profile.nativeLanguage')}</th>
                <th className="px-5 py-2.5 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-sand-50 dark:hover:bg-neutral-850 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="font-semibold text-ink dark:text-neutral-0">
                      {u.name || '—'}
                    </span>
                    {isSelf(u) && (
                      <span className="ms-2 inline-block bg-sand-200 dark:bg-sand-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink dark:text-sand-50">
                        {t('admin.you')}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                    {u.email || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        u.role === 'admin'
                          ? 'inline-block bg-accent-700/12 dark:bg-accent-400/15 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] text-accent-700 dark:text-accent-300'
                          : 'inline-block bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.1em] text-neutral-600 dark:text-neutral-300'
                      }
                    >
                      {t(`admin.roles.${u.role || 'user'}`)}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    {u.nativeLanguage || '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <ViewButton
                        to={`/admin/users/${u._id}`}
                        label={t('admin.viewUser')}
                      />
                      <EditButton
                        onClick={() => openEdit(u)}
                        label={t('common.edit')}
                      />
                      {!isSelf(u) && (
                        <DeleteButton
                          onClick={() => setUserToDelete(u)}
                          label={t('common.delete')}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modale d'édition */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title={t('admin.editUser')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditUser(null)}>
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
          disableRole={editUser && isSelf(editUser)}
        />
      </Modal>

      {/* Modale de confirmation suppression */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title={t('admin.deleteUser')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setUserToDelete(null)}>
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
          {userToDelete && (
            <p className="text-base font-bold text-ink dark:text-neutral-0">
              {userToDelete.name} <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">· {userToDelete.email}</span>
            </p>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default AdminUsers;
