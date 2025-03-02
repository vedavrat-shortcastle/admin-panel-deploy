'use client';
import AuthRedirect from '@/components/auth/AuthRedirect';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthRedirect redirectToLogin={false}>
      <div className="min-h-screen flex justify-center items-center">
        <LoginForm />
      </div>
    </AuthRedirect>
  );
}
