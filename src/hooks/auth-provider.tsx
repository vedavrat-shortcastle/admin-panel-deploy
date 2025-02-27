'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, verifyJWT } from '@/utils/encoder';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean; // Add loading state to the context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      verifyJWT(token)
        .then((result) => {
          if (result.verify) {
            setIsAuthenticated(true);
            setUser(result);
            if (pathname === '/login') {
              router.push('/');
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            if (pathname !== '/login') {
              router.push('/login');
            }
          }
        })
        .catch((error) => {
          console.error('Invalid token:', error);
          setIsAuthenticated(false);
          setUser(null);
          if (pathname !== '/login') {
            router.push('/login');
          }
        })
        .finally(() => {
          setLoading(false); // Set loading to false after verification
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
      setLoading(false); // Set loading to false if no token
    }
  }, [router, pathname]);

  if (loading) {
    return <div>Loading...</div>; // Show loader while checking authentication
  }

  if (!isAuthenticated && pathname !== '/login') {
    router.push('/login');
    return null; // Prevent rendering children if not authenticated
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
