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

        return {
          id: user.id.toString(), // NextAuth expects string id
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
