'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectToLogin?: boolean; // Optional prop to conditionally enable redirect to login
}

export default function AuthRedirect({
  children,
  redirectToLogin = true,
}: AuthRedirectProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = status === 'authenticated';
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) {
      if (redirectToLogin && !isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/contacts'); // Redirect to homepage after login if on login page
      }
    }
  }, [isAuthenticated, loading, pathname, router, redirectToLogin]); // Include redirectToLogin in dependencies

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoaderCircle size={44} className="animate-spin text-primary" />
      </div>
    );
  }

  // If not redirecting and not loading, render children
  if (!loading && ((redirectToLogin && isAuthenticated) || !redirectToLogin)) {
    return <>{children}</>;
  }

  return null; // Return null if redirecting
}
