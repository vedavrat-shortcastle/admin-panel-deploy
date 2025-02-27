import { z } from 'zod';
import { router, procedure } from '@/app/server/trpc';
import { generateJWT, hashPassword, verifyPassword } from '@/utils/encoder';

export const authRouter = router({
  login: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.adminUser.findUnique({
        where: { email: input.email },
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      });

      if (!user) {
        throw new Error(
          JSON.stringify({ field: 'email', message: 'Invalid email' })
        );
      }

      const isValid = await verifyPassword(input.password, user.password);
      if (!isValid) {
        throw new Error(
          JSON.stringify({ field: 'password', message: 'Invalid password' })
        );
      }

      const token = await generateJWT({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        permissions: user.permissions.map((p) => p.permission),
      });

      return {
        token,
      };
    }),
  signUp: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.db.adminUser.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = await ctx.db.adminUser.create({
        data: {
          email: input.email,
          password: await hashPassword(input.password),
          firstName: input.firstName,
          lastName: input.lastName,
          role: 'ADMIN',
        },
      });

      return user;
    }),
});
