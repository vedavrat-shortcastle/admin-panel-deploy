import { z } from 'zod';
import { procedure, router } from '@/app/server/trpc';

export const usersRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      take: 10,
      select: {
        uuid: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    });
    return users;
  }),
  getById: procedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.user.findUnique({
      where: { uuid: input },
    });
  }),
});
