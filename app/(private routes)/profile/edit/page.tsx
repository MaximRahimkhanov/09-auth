'use client';

import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { updateMe } from '@/lib/api/clientApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EditProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const router = useRouter();
  const [error, setError] = useState('');
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const updatedUser = await updateMe({ username });

      if (updatedUser) {
        setUser(updatedUser);
        router.push('/profile');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } }; message?: string };
      setError(
        apiError?.response?.data?.error ?? apiError?.message ?? 'Unexpected error occurred.'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user?.avatar && (
          <Image
            src={`${user?.avatar}`}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form onSubmit={handleSave} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" onClick={() => router.back()} className={css.cancelButton}>
              Cancel
            </button>
          </div>
          <span>{error}</span>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
