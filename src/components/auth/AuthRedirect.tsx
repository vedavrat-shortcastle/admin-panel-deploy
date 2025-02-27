'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectToLogin?: boolean;
}

export default function AuthRedirect({
  children,
  redirectToLogin = true,
}: AuthRedirectProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (redirectToLogin && pathname !== '/login') {
        router.push('/login');
      }
    } else if (status === 'authenticated') {
      if (pathname === '/login') {
        router.push('/'); // Redirect to homepage if on login page when logged in
      }
    }
  }, [isAuthenticated, pathname, router, redirectToLogin, status]); // Now include status in dependencies

  // **Conditional Rendering to Prevent FOAC:**
  if (status === 'loading') {
    return <div>Loading...</div>; // Still show loading state
  }

  if (redirectToLogin && status === 'unauthenticated') {
    return null; // **Return null to prevent rendering children for unauthenticated users**
  }

  // If authenticated or no redirectToLogin is needed, render children
  return <>{children}</>;
}
