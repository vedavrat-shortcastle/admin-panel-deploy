// types/next-auth.d.ts
import { AdminRole, Permission } from '@prisma/client';
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
    role?: AdminRole;
    permissions?: Permission[];
  }

  interface JWT {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: AdminRole;
    permissions?: Permission[];
  }
}
