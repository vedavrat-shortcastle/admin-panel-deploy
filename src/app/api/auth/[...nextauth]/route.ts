import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyPassword } from '@/utils/encoder';
import { db } from '@/lib/db';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validationResult = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!validationResult.success) {
          return null; // Or throw an error if you prefer, NextAuth will handle it
        }

        const { email, password } = validationResult.data;

        const user = await db.adminUser.findUnique({
          // Use your database context here
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

        // If everything is ok, return a user object.
        // The shape of this object is up to you, but it should contain at least `id` and `email`.
        // You can add other user properties that you want to be available in the session.
        return {
          id: user.id.toString(), // NextAuth expects string id
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          permissions: user.permissions.map((p) => p.permission), // You can include permissions in the session if needed
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt', // You can use 'jwt' or 'database' session strategy. 'jwt' is generally preferred for statelessness
  },
  // You can define callbacks to further control the authentication process
  callbacks: {
    async jwt({ token, user }) {
      // This JWT callback is called when a JWT is created (e.g., sign in) and when the JWT is verified.
      // You can add custom claims to the JWT token here.
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions; // Add permissions to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }
      session.user.role = token.role as string;
      session.user.permissions = token.permissions as any[]; // Ensure type consistency
      session.user.id = token.sub as string; // Include user id in session
      session.user.email = token.email as string; // Include user email in session (if you have email in token)
      // Use it to augment the session object with data from the token.
      if (token) {
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as any[];
        session.user.id = token.sub as string; // Include user id in session
        session.user.email = token.email as string; // Include user email in session (if you have email in token)
        // Optionally add firstName, lastName if you included them in the authorize return and want them in session
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
