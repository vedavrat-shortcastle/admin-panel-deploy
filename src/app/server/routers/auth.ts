import { z } from 'zod';
import { router, procedure } from '@/app/server/trpc';
import { hashPassword } from '@/utils/encoder';

export const authRouter = router({
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
