'use client';
import { register, RegisterRequest } from '@/lib/api/clientApi';
import css from './SignUpPage.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ApiError } from '@/types/error';
import { useAuthStore } from '@/lib/store/authStore';

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const setUser = useAuthStore((state) => state.setUser);
  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as unknown as RegisterRequest;
      const user = await register(formValues);
      if (user) {
        router.push('/profile');
        setUser(user);
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
};
export default SignUp;
