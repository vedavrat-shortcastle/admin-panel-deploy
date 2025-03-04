// types/next-auth.d.ts
import { Permission } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: AdminRole;
      permissions?: any[];
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    permissions?: Permission[];
  }

  interface JWT {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    permissions?: Permission[];
  }
}
