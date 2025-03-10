// lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/utils/encoder';
import { AuthOptions } from 'next-auth';
import { generateOTP, sendOTPEmail } from '@/utils/otpHandler';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const { email, password, otp } = credentials;

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

        // Handle OTP verification
        if (!otp) {
          // Generate and send OTP
          const newOTP = generateOTP();
          const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          await db.adminUser.update({
            where: { id: user.id },
            data: {
              otpToken: newOTP,
              otpExpiry,
            },
          });

          await sendOTPEmail(user.email, newOTP);
          throw new Error(JSON.stringify({ type: 'otp', message: 'OTP sent' }));
        }

        // Verify OTP
        if (
          user.otpToken !== otp ||
          !user.otpExpiry ||
          user.otpExpiry < new Date()
        ) {
          throw new Error(
            JSON.stringify({ type: 'otp', message: 'Invalid or expired OTP' })
          );
        }

        // Clear OTP after successful verification
        await db.adminUser.update({
          where: { id: user.id },
          data: {
            otpToken: null,
            otpExpiry: null,
          },
        });

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
