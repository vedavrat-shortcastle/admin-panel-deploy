import NextAuth from 'next-auth/next';
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
          return null; // Or throw an error
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          return null; // Or throw an error
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
        token.role = user.role;
        token.permissions = user.permissions;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, ...token, id: token.sub };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
