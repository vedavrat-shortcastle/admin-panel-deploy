// lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/utils/encoder';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const { email, password } = credentials;

        const user = await db.adminUser.findUnique({
          where: { email: email },
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        });

        if (!user) {
          throw new Error(
            JSON.stringify({ type: 'email', message: 'User not found' })
          );
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          throw new Error(
            JSON.stringify({ type: 'password', message: 'Invalid password' })
          );
        }

        // Ensure all fields are returned
        return {
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          permissions: user.permissions.map((p) => p.permission),
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, add all data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.permissions = user.permissions;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer all data from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as any[];
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
};
